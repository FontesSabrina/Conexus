<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';

// --- IMPORTS DOS STORES ---
import { useAlunoStore } from '@/stores/alunoStore';
import { useFormaPagamentoStore } from '@/stores/formaPagamentoStores';
// import { useFinanceiroStore } from '@/stores/financeiroStore'; 

const router = useRouter();

// --- INICIALIZAÇÃO DOS STORES ---
const alunoStore = useAlunoStore();
const formaPagamentoStore = useFormaPagamentoStore();
// const financeiroStore = useFinanceiroStore(); 

// --- PROPS ---
const props = defineProps({
    pageTitle: {
        type: String,
        default: 'Relatório Financeiro Detalhado'
    },
    financialData: {
        type: Array,
        default: () => []
    }
});

// --- 1. DADOS E ESTRUTURA ---
const reportContent = ref(null);

const reportData = computed(() => {
    // Quando o store estiver pronto, descomentar abaixo:
    // return financeiroStore.movimentacoesFinanceiras?.length > 0 ? financeiroStore.movimentacoesFinanceiras : props.financialData;
    return props.financialData; 
});

const headers = [
    { title: 'ALUNO', key: 'studentId' },
    { title: 'VALOR BASE', key: 'value' },
    { title: 'VENCIMENTO', key: 'dueDate' },
    { title: 'STATUS', key: 'status' },
    { title: 'PAGAMENTO', key: 'paymentDate' },
    { title: 'MULTA', key: 'fine' },
    { title: 'TOTAL PAGO', key: 'totalPaid' },
];

// Estatísticas para os cards de topo
const totalFines = computed(() => reportData.value.reduce((acc, item) => acc + (item.fine || 0), 0));
const totalPaid = computed(() => reportData.value.reduce((acc, item) => acc + (item.totalPaid || 0), 0));
const totalPending = computed(() => reportData.value.filter(item => item.status?.toLowerCase() === 'pendente').length);

// --- 2. LÓGICA DE AÇÕES ---

const generatePDF = () => {
    if (!reportContent.value) return;

    const options = {
        margin: [10, 10, 10, 10],
        filename: `Relatorio_Financeiro_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().from(reportContent.value).set(options).save();
};

function cancelForm() {
    router.push('/admin/dashboard'); 
}

onMounted(() => {
    // financeiroStore.buscarDadosFinanceiros(); 
    // alunoStore.exibir(); 
});
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row class="mb-6">
            <v-col cols="12">
                <v-card flat class="hero-financeiro rounded-xl pa-6 text-white shadow-main">
                    <v-row align="center">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="56" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon size="28">mdi-file-chart</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h5 font-weight-black mb-0">{{ props.pageTitle }}</h1>
                                    <p class="text-caption opacity-80 mb-0 text-uppercase tracking-widest">Controle de Fluxo de Caixa e Inadimplência</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="4" class="text-md-right">
                            <v-btn icon color="white" variant="text" @click="cancelForm" class="mr-2">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-6" v-if="reportData.length > 0">
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-brand">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Total Recebido</div>
                    <div class="text-h5 font-weight-black text-success">R$ {{ totalPaid.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-red">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Arrecadado em Multas</div>
                    <div class="text-h5 font-weight-black text-error">R$ {{ totalFines.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-warning">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Parcelas Pendentes</div>
                    <div class="text-h5 font-weight-black text-warning">{{ totalPending }}</div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden shadow-main bg-white">
            <div ref="reportContent" class="pa-8 bg-white print-area">
                <div class="d-flex justify-space-between align-center mb-6 border-b pb-4">
                    <div>
                        <h2 class="text-h6 font-weight-black text-brand">CONEXUS GESTÃO ESCOLAR</h2>
                        <p class="text-caption text-grey">Data de Emissão: {{ new Date().toLocaleString() }}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-overline font-weight-bold mb-0">Status: Consolidado</p>
                    </div>
                </div>

                <v-table v-if="reportData.length > 0" density="comfortable" class="custom-report-table">
                    <thead>
                        <tr>
                            <th v-for="header in headers" :key="header.key" class="text-left font-weight-black text-grey-darken-3 py-4">
                                {{ header.title }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in reportData" :key="item.studentId" class="report-row">
                            <td class="font-weight-bold">#{{ item.studentId }}</td>
                            <td>R$ {{ item.value.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</td>
                            <td>{{ item.dueDate }}</td>
                            <td>
                                <v-chip size="x-small" :color="item.status === 'Pago' ? 'success' : 'warning'" variant="tonal" class="font-weight-black">
                                    {{ item.status }}
                                </v-chip>
                            </td>
                            <td class="text-grey">{{ item.paymentDate || '---' }}</td>
                            <td class="text-error font-weight-bold">R$ {{ item.fine.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</td>
                            <td class="bg-grey-lighten-5 font-weight-black">R$ {{ item.totalPaid.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr class="bg-grey-darken-4 text-white">
                            <td colspan="5" class="text-right font-weight-bold text-uppercase py-4">Resumo Consolidado</td>
                            <td class="font-weight-black">R$ {{ totalFines.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</td>
                            <td class="font-weight-black text-brand text-h6">R$ {{ totalPaid.toLocaleString('pt-BR', {minimumFractionDigits: 2}) }}</td>
                        </tr>
                    </tfoot>
                </v-table>
                
                <div v-else class="text-center py-12">
                    <v-icon size="64" color="grey-lighten-2">mdi-finance</v-icon>
                    <p class="text-grey-darken-1 mt-4">Nenhum dado financeiro para processar no período selecionado.</p>
                </div>
            </div>

            <v-divider></v-divider>
            <div class="pa-6 bg-grey-lighten-4 d-flex flex-wrap gap-4">
                <v-btn
                    color="orange-darken-1"
                    size="large"
                    class="rounded-lg font-weight-bold text-none shadow-main px-8"
                    prepend-icon="mdi-file-pdf-box"
                    @click="generatePDF"
                    :disabled="reportData.length === 0"
                >
                    GERAR RELATÓRIO PDF
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                    @click="cancelForm"
                    variant="outlined"
                    color="grey-darken-1"
                    class="rounded-lg font-weight-bold text-none"
                    prepend-icon="mdi-arrow-left"
                >
                    VOLTAR AO DASHBOARD
                </v-btn>
            </div>
        </v-card>
    </v-container>
</template>

<style scoped>
.hero-financeiro {
    background: linear-gradient(135deg, #fb910a 0%, #e67e00 100%) !important;
}

.text-brand { color: #fb910a !important; }
.border-l-brand { border-left: 5px solid #fb910a !important; }
.border-l-success { border-left: 5px solid #4CAF50 !important; }
.border-l-red { border-left: 5px solid #FF5252 !important; }
.border-l-warning { border-left: 5px solid #FB8C00 !important; }

.shadow-main { box-shadow: 0 4px 18px rgba(0,0,0,0.06) !important; }
.shadow-soft { box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
.backdrop-blur { backdrop-filter: blur(10px); }

.print-area {
    font-family: 'Inter', sans-serif !important;
}

.custom-report-table :deep(thead th) {
    background-color: #f8f9fa !important;
    font-size: 0.75rem !important;
    letter-spacing: 0.5px;
    border-bottom: 2px solid #fb910a !important;
}

.report-row td {
    border-bottom: 1px solid #f0f0f0 !important;
    font-size: 0.85rem !important;
}

.gap-4 { gap: 16px; }

@media print {
    .v-btn, .v-divider { display: none !important; }
}
</style>