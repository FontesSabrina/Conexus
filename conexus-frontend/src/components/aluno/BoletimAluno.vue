<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAvaliacaoStore } from '@/stores/avaliacaoStores'; 
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore'; 

const alunoTurmaStore = useAlunoTurmaStore();
const avaliacaoStore = useAvaliacaoStore();

const SELECAO_INICIAL = '-- Selecione um Curso --';

const cursoSelecionado = ref(SELECAO_INICIAL);
const notasDoCurso = computed(() => avaliacaoStore.notas); 
const dadosCarregados = ref(false);
const isLoading = computed(() => avaliacaoStore.isLoading); 

const cursosDisponiveis = computed(() => [
    SELECAO_INICIAL, 
    ...(alunoTurmaStore.cursos ?? []).map(c => c.nome) 
]);

const cabecalhos = ref([
    { title: 'Disciplina', key: 'disciplina', align: 'start', sortable: true },
    { title: 'Atividade', key: 'atividade', align: 'start' },
    { title: 'Data', key: 'data', align: 'center' },
    { title: 'Nota', key: 'nota', align: 'center' },
    { title: 'Status', key: 'status', align: 'center' },
]);

const cursoEstaSelecionado = computed(() => cursoSelecionado.value !== SELECAO_INICIAL);

const getCorStatus = (status) => {
    switch (status) {
        case 'Aprovado': return '#43A047';
        case 'Recuperação': return '#FB8C00';
        case 'Pendente': return '#1E88E5';
        case 'Reprovado': return '#E53935';
        default: return 'grey';
    }
};

async function visualizarBoletim() {
    if (cursoEstaSelecionado.value) {
        const cursoId = alunoTurmaStore.cursos.find(c => c.nome === cursoSelecionado.value)?.id;
        if (cursoId) {
            const sucesso = await avaliacaoStore.buscarNotasPorCurso(cursoId); 
            dadosCarregados.value = sucesso;
        } else {
            dadosCarregados.value = false;
        }
    } else {
        dadosCarregados.value = false;
    }
}

onMounted(() => {
    alunoTurmaStore.exibir(); 
});
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-notas rounded-xl pa-8 mb-6 position-relative overflow-hidden">
                    <div class="deco-circle"></div>
                    
                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="6">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon color="white" size="32">mdi-chart-areaspline</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black text-white mb-1">Desempenho Escolar</h1>
                                    <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                                        Consulte suas notas e status por disciplina.
                                    </p>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-card flat color="rgba(0,0,0,0.1)" class="rounded-xl pa-2 backdrop-blur border-glass">
                                <v-row no-gutters align="center">
                                    <v-col class="pa-2">
                                        <v-select 
                                            :items="cursosDisponiveis" 
                                            v-model="cursoSelecionado" 
                                            variant="solo" 
                                            flat
                                            density="comfortable" 
                                            hide-details 
                                            placeholder="Selecione o Curso"
                                            bg-color="transparent"
                                            theme="dark"
                                            class="custom-select"
                                        ></v-select>
                                    </v-col>
                                    <v-col cols="auto" class="pa-2">
                                        <v-btn 
                                            color="white" 
                                            height="48"
                                            class="px-8 font-weight-black text-teal-darken-3 rounded-lg"
                                            @click="visualizarBoletim" 
                                            :disabled="!cursoEstaSelecionado || isLoading"
                                            :loading="isLoading"
                                        > 
                                            VER NOTAS
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12">
                
                <v-card v-if="isLoading" flat class="pa-12 text-center rounded-xl bg-surface border">
                    <v-progress-circular indeterminate color="#2fa99e" size="64" width="6"></v-progress-circular>
                    <p class="mt-4 font-weight-bold opacity-60">BUSCANDO REGISTROS...</p>
                </v-card>
                
                <v-card v-else-if="!dadosCarregados" flat class="pa-12 text-center rounded-xl border-dashed bg-surface-variant opacity-60">
                    <v-icon size="80" color="grey-lighten-1">mdi-file-find-outline</v-icon>
                    <h3 class="text-h6 font-weight-bold mt-4">Nenhum curso visualizado</h3>
                    <p>Selecione um curso acima para carregar o seu boletim detalhado.</p>
                </v-card>

                <v-card v-else flat border class="rounded-xl overflow-hidden shadow-main bg-surface">
                    <v-data-table 
                        :headers="cabecalhos" 
                        :items="notasDoCurso" 
                        class="custom-table"
                        hover
                    >
                        <template v-slot:item.status="{ item }">
                            <v-chip 
                                :color="getCorStatus(item.status)" 
                                size="small"
                                class="font-weight-black text-uppercase px-4" 
                                variant="flat"
                                rounded="lg"
                            > 
                                {{ item.status }} 
                            </v-chip>
                        </template>

                        <template v-slot:item.nota="{ item }">
                            <span class="font-weight-black text-h6" :class="item.nota >= 7 ? 'text-success' : 'text-error'">
                                {{ item.nota.toFixed(1) }}
                            </span>
                        </template>

                        <template v-slot:bottom>
                            <v-divider></v-divider>
                            <div class="pa-4 bg-card-sub d-flex align-center justify-center">
                                <v-icon size="small" color="grey" class="mr-2">mdi-information-outline</v-icon>
                                <span class="text-caption font-weight-bold opacity-60 text-uppercase" style="letter-spacing: 1px;">
                                    A Média Final é calculada após a conclusão de todas as atividades.
                                </span>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* BANNER TEMA AZUL/VERDE-ÁGUA */
.hero-notas {
    background: linear-gradient(135deg, #2fa99e 0%, #1d7a72 100%) !important;
    box-shadow: 0 10px 30px rgba(47, 169, 158, 0.3) !important;
}

.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    width: 400px;
    height: 400px;
    top: -150px;
    right: -100px;
}

.border-glass {
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.backdrop-blur {
    backdrop-filter: blur(12px);
}

/* CUSTOMIZAÇÃO DA TABELA */
.custom-table :deep(thead) {
    background-color: rgba(var(--v-border-color), 0.03);
}

.custom-table :deep(th) {
    text-transform: uppercase !important;
    font-weight: 900 !important;
    letter-spacing: 1px !important;
    font-size: 0.75rem !important;
    color: rgba(0,0,0,0.6) !important;
}

.custom-table :deep(td) {
    height: 64px !important;
    font-size: 0.9rem !important;
}

.bg-card-sub {
    background-color: rgba(var(--v-border-color), 0.02);
}

.border-dashed {
    border: 2px dashed rgba(var(--v-border-color), 0.2) !important;
}

.shadow-main {
    box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
}

.z-index-1 { z-index: 1; }
</style>