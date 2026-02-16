<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import html2pdf from 'html2pdf.js';
import { useMaterialStore } from '@/stores/materialStore';

const router = useRouter();
const materialStore = useMaterialStore();
const isLoading = ref(true);

// --- PROPS ---
const props = defineProps({
    pageTitle: {
        type: String,
        default: 'Relatório de Inventário de Materiais'
    }
});

// --- 1. DADOS E ESTRUTURA ---
const reportContent = ref(null);

const headers = [
    { title: 'TÍTULO DO MATERIAL', align: 'start', key: 'title' },
    { title: 'QTD EM ESTOQUE', align: 'center', key: 'quantity' },
    { title: 'FORMATO / TIPO', align: 'center', key: 'format' },
];

// Fonte de dados mapeada do Store
const reportMaterials = computed(() => {
    if (!materialStore.materiais) return [];
    
    return materialStore.materiais.map(item => ({
        title: item.titulo,
        quantity: item.quantidade,
        format: item.formatoarquivo || 'Físico',
    }));
});

// KPIs de Resumo
const totalItens = computed(() => reportMaterials.value.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0));
const tiposDiferentes = computed(() => new Set(reportMaterials.value.map(m => m.format)).size);

onMounted(async () => {
    isLoading.value = true;
    try {
        await materialStore.exibir(); 
    } finally {
        isLoading.value = false;
    }
});

// --- 2. LÓGICA DE AÇÕES ---
const generatePDF = () => {
    if (!reportContent.value) return;

    const options = {
        margin: [10, 10, 10, 10],
        filename: `Relatorio_Materiais_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(reportContent.value).set(options).save();
};

function cancelForm() {
    router.push('/admin/dashboard'); 
}
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row class="mb-6">
            <v-col cols="12">
                <v-card flat class="hero-materials rounded-xl pa-6 text-white shadow-main">
                    <v-row align="center">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="56" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon size="28">mdi-archive-outline</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h5 font-weight-black mb-0">{{ props.pageTitle }}</h1>
                                    <p class="text-caption opacity-80 mb-0 text-uppercase tracking-widest">Controle de Acervo e Recursos Didáticos</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="4" class="text-md-right">
                            <v-btn icon color="white" variant="text" @click="cancelForm">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-6" v-if="!isLoading && reportMaterials.length > 0">
            <v-col cols="12" sm="6" md="3">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-brand">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Total de Itens</div>
                    <div class="text-h5 font-weight-black text-brand">{{ totalItens }} unidades</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-info">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Variedade de Formatos</div>
                    <div class="text-h5 font-weight-black text-info">{{ tiposDiferentes }} tipos</div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden shadow-main bg-white">
            
            <v-row v-if="isLoading" justify="center" class="py-12">
                <v-progress-circular indeterminate color="orange-darken-1" size="64"></v-progress-circular>
            </v-row>

            <template v-else>
                <div ref="reportContent" class="pa-10 bg-white print-area">
                    <div class="d-flex justify-space-between align-center mb-8 border-b pb-6">
                        <div>
                            <h2 class="text-h6 font-weight-black text-brand">CONEXUS GESTÃO ACADÊMICA</h2>
                            <p class="text-caption text-grey mb-0">Emitido em: {{ new Date().toLocaleString('pt-BR') }}</p>
                        </div>
                        <v-chip color="orange-darken-1" variant="outlined" size="small" class="font-weight-bold">
                            RELATÓRIO DE ESTOQUE
                        </v-chip>
                    </div>

                    <v-table v-if="reportMaterials.length > 0" density="comfortable" class="custom-report-table">
                        <thead>
                            <tr>
                                <th v-for="header in headers" :key="header.key" 
                                    :class="['text-' + (header.align || 'left'), 'font-weight-black text-grey-darken-3 py-4']">
                                    {{ header.title }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in reportMaterials" :key="item.title" class="report-row">
                                <td class="font-weight-bold text-grey-darken-3">{{ item.title }}</td>
                                <td class="text-center">
                                    <v-chip size="x-small" :color="item.quantity > 0 ? 'success' : 'error'" variant="tonal">
                                        {{ item.quantity }} un.
                                    </v-chip>
                                </td>
                                <td class="text-center text-body-2 text-grey-darken-1">
                                    <v-icon size="14" class="mr-1">mdi-file-outline</v-icon>
                                    {{ item.format }}
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <div v-else class="text-center py-12">
                        <v-icon size="64" color="grey-lighten-2">mdi-package-variant</v-icon>
                        <p class="text-grey-darken-1 mt-4 font-weight-medium">Nenhum material cadastrado no sistema.</p>
                    </div>

                    <div class="mt-12 pt-6 border-t d-flex justify-space-between text-caption text-grey italic">
                        <span>Documento gerado eletronicamente via Sistema Conexus</span>
                        <span>Página 1 de 1</span>
                    </div>
                </div>

                <v-divider></v-divider>
                <div class="pa-6 bg-grey-lighten-4 d-flex flex-wrap gap-4">
                    <v-btn
                        color="orange-darken-1"
                        size="large"
                        class="rounded-lg font-weight-bold text-none px-8 shadow-soft"
                        prepend-icon="mdi-file-pdf-box"
                        @click="generatePDF"
                        :disabled="reportMaterials.length === 0"
                    >
                        BAIXAR PDF
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="cancelForm"
                        variant="text"
                        color="grey-darken-1"
                        class="rounded-lg font-weight-bold text-none"
                    >
                        CANCELAR E VOLTAR
                    </v-btn>
                </div>
            </template>
        </v-card>
    </v-container>
</template>

<style scoped>
.hero-materials {
    background: linear-gradient(135deg, #fb910a 0%, #ff6b00 100%) !important;
}

.text-brand { color: #fb910a !important; }
.border-l-brand { border-left: 5px solid #fb910a !important; }
.border-l-info { border-left: 5px solid #00B0FF !important; }

.shadow-main { box-shadow: 0 4px 18px rgba(0,0,0,0.06) !important; }
.shadow-soft { box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
.backdrop-blur { backdrop-filter: blur(10px); }

.print-area {
    font-family: 'Inter', sans-serif !important;
}

.custom-report-table :deep(thead th) {
    background-color: #fcfcfc !important;
    font-size: 0.7rem !important;
    letter-spacing: 1px;
    border-bottom: 2px solid #eee !important;
}

.report-row td {
    border-bottom: 1px solid #f9f9f9 !important;
    padding: 16px 8px !important;
}

.gap-4 { gap: 16px; }

@media print {
    .v-btn, .v-divider { display: none !important; }
}
</style>