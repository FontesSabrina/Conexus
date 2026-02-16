<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFormaPagamentoStore } from '@/stores/formaPagamentoStores'; 
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore'; 

const formaPagamentoStore = useFormaPagamentoStore();
const alunoTurmaStore = useAlunoTurmaStore();

const SELECAO_INICIAL = '-- Todas as Transações --';
const filtroCurso = ref(SELECAO_INICIAL);

// Estado Reativo com proteção contra dados nulos
const todasAsTransacoes = computed(() => formaPagamentoStore.transacoes || []);
const isLoading = computed(() => formaPagamentoStore.isLoading); 

const cabecalhos = ref([
    { title: 'Descrição', key: 'descricao', align: 'start' },
    { title: 'Vencimento', key: 'vencimento', align: 'center' },
    { title: 'Valor', key: 'valor', align: 'end' },
    { title: 'Status', key: 'status', align: 'center' },
    { title: 'Ações', key: 'acoes', align: 'center', sortable: false },
]);

const cursosDisponiveis = computed(() => [
    SELECAO_INICIAL,
    ...(alunoTurmaStore.cursos ?? []).map(c => c.nome),
    'Taxas Diversas' 
]);

const transacoesFiltradas = computed(() => {
    if (filtroCurso.value === SELECAO_INICIAL) return todasAsTransacoes.value;
    return todasAsTransacoes.value.filter(t => t.curso === filtroCurso.value);
});

const getCorStatus = (status) => {
    switch (status) {
        case 'Pago': return '#43A047';
        case 'Aberto': return '#2fa99e'; // Cor padrão do sistema
        case 'Atrasado': return '#E53935';
        default: return '#757575';
    }
};

async function lidarComPagamento(transacao) {
    const confirmacao = confirm(`Deseja iniciar o pagamento de ${transacao.valor} referente a ${transacao.descricao}?`);
    if (confirmacao) {
        const sucesso = await formaPagamentoStore.iniciarPagamento(transacao.id);
        if (sucesso) {
            await formaPagamentoStore.buscarTransacoes(); 
        }
    }
}

onMounted(() => {
    alunoTurmaStore.exibir();
    formaPagamentoStore.exibir();
});
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-conexus rounded-xl pa-8 mb-6 position-relative overflow-hidden">
                    <div class="deco-circle"></div>
                    
                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="7">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon color="white" size="32">mdi-cash-register</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black text-white mb-1">Financeiro</h1>
                                    <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                                        Confira seus compromissos e histórico financeiro
                                    </p>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" md="5">
                            <v-select
                                :items="cursosDisponiveis"
                                v-model="filtroCurso"
                                label="Filtrar por Categoria"
                                variant="solo"
                                flat
                                density="comfortable"
                                hide-details
                                bg-color="rgba(255,255,255,0.2)"
                                theme="dark"
                                class="rounded-lg custom-filter"
                                prepend-inner-icon="mdi-filter-outline"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4" v-if="!isLoading">
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main border-l-primary">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Lançamentos</div>
                    <div class="text-h5 font-weight-black text-conexus">{{ transacoesFiltradas.length }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
                    <div class="text-caption font-weight-bold text-success text-uppercase">Confirmados</div>
                    <div class="text-h5 font-weight-black text-success">
                        {{ transacoesFiltradas.filter(t => t.status === 'Pago').length }}
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
                    <div class="text-caption font-weight-bold text-error text-uppercase">Pendentes</div>
                    <div class="text-h5 font-weight-black text-error">
                        {{ transacoesFiltradas.filter(t => t.status !== 'Pago').length }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden shadow-main bg-surface">
            <v-data-table
                v-if="!isLoading"
                :headers="cabecalhos"
                :items="transacoesFiltradas"
                class="custom-table"
                hover
            >
                <template v-slot:item.status="{ value }">
                    <v-chip
                        :color="getCorStatus(value)"
                        size="small"
                        class="font-weight-black text-uppercase"
                        variant="tonal"
                        rounded="lg"
                    >
                        {{ value }}
                    </v-chip>
                </template>

                <template v-slot:item.valor="{ value }">
                    <span class="font-weight-bold text-conexus">{{ value }}</span>
                </template>
                
                <template v-slot:item.acoes="{ item }">
                    <v-btn
                        v-if="item.status !== 'Pago'"
                        color="#2fa99e"
                        variant="flat"
                        size="small"
                        class="rounded-lg font-weight-bold text-white"
                        @click="lidarComPagamento(item)"
                    >
                        PAGAR
                    </v-btn>
                    <v-icon v-else color="#2fa99e" size="large">mdi-check-circle</v-icon>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50">
                        Sincronizado com a tesouraria • Conexus 2025
                    </div>
                </template>
            </v-data-table>

            <div v-else class="pa-12 text-center">
                <v-progress-circular indeterminate color="#2fa99e" size="50"></v-progress-circular>
            </div>
        </v-card>
    </v-container>
</template>

<style scoped>
/* CORES DO TEMA #2fa99e */
.hero-conexus {
    background: linear-gradient(135deg, #2fa99e 0%, #248a81 100%) !important;
}

.text-conexus {
    color: #2fa99e !important;
}

.border-l-primary {
    border-left: 4px solid #2fa99e !important;
}

.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    width: 250px;
    height: 250px;
    top: -80px;
    right: -40px;
}

/* TABELA E CARDS */
.custom-table :deep(th) {
    font-weight: 800 !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    letter-spacing: 0.5px;
}

.shadow-main {
    box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important;
}

.bg-card-sub {
    background-color: rgba(47, 169, 158, 0.03);
}

.z-index-1 { z-index: 1; }
.backdrop-blur { backdrop-filter: blur(8px); }

.custom-filter :deep(.v-field__input) {
    color: white !important;
}
</style>