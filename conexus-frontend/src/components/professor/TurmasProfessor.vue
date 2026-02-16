<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTurmaStore } from '@/stores/turmaStore';

const router = useRouter(); 
const turmaStore = useTurmaStore();

const turmas = computed(() => turmaStore.turmas || []);
const isLoading = ref(false);

const headers = ref([
    { title: 'SALA / AMBIENTE', align: 'start', key: 'sala', width: '25%' },
    { title: 'IDIOMA / NÍVEL', align: 'start', key: 'idioma' },
    { title: 'PROFESSOR', align: 'start', key: 'professor' },
    { title: 'DIAS', align: 'start', key: 'diasSemana' },
    { title: 'HORÁRIO', align: 'start', key: 'horario' },
    { title: 'AÇÕES', align: 'center', key: 'actions', sortable: false },
]);


function handleMarcarPresenca(item) {
    router.push({
        name: 'RegistroPresenca', 
        params: { turmaId: item.idturma }
    });
}

function goToDashboard() {
    router.push({ path: '/professor/dashboard' });
}

onMounted(async () => { 
    isLoading.value = true;
    try {
        await turmaStore.exibir();
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-conexus rounded-xl pa-8 mb-6 position-relative overflow-hidden">
                    <div class="deco-circle"></div>
                    
                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon color="white" size="32">mdi-google-classroom</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black text-white mb-1">Minhas Turmas</h1>
                                    <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                                        Gerencie seus horários e registros de presença diários
                                    </p>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" md="4" class="text-md-right">
                            <v-btn
                                color="white"
                                prepend-icon="mdi-arrow-left"
                                variant="elevated"
                                class="rounded-lg font-weight-bold text-amber-darken-4 px-6 shadow-soft"
                                @click="goToDashboard"
                            >
                                VOLTAR AO PAINEL
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4" v-if="!isLoading">
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main border-l-primary">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Turmas Vinculadas</div>
                    <div class="text-h5 font-weight-black text-brand">{{ turmas.length }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
                    <div class="text-caption font-weight-bold text-grey text-uppercase">Status de Registro</div>
                    <div class="d-flex align-center">
                        <v-badge dot color="success" class="mr-2" inline></v-badge>
                        <span class="text-body-1 font-weight-bold">Sistema Ativo</span>
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
                    <div class="text-caption font-weight-bold text-grey text-uppercase">Data de Hoje</div>
                    <div class="text-h6 font-weight-bold">
                        {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }) }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden shadow-main bg-surface">
            <v-data-table 
                :headers="headers" 
                :items="turmas" 
                :loading="isLoading" 
                class="custom-table"
                hover
                no-data-text="Nenhuma turma encontrada."
            >
                <template #[`item.sala`]="{ item }">
                    <div class="d-flex align-center py-3">
                        <v-avatar size="32" color="rgba(255, 179, 0, 0.1)" class="mr-3">
                            <v-icon color="#ffb300" size="18">mdi-door-open</v-icon>
                        </v-avatar>
                        <span class="font-weight-black text-grey-darken-3">{{ item.sala || 'N/A' }}</span>
                    </div>
                </template>

                <template #[`item.idioma`]="{ item }">
                    <div class="d-flex flex-column">
                        <v-chip size="x-small" color="#ffb300" variant="tonal" class="font-weight-black mb-1" style="max-width: fit-content">
                            {{ item.idioma }}
                        </v-chip>
                        <span class="text-caption font-weight-bold text-grey">{{ item.nivel }}</span>
                    </div>
                </template>

                <template #[`item.nomeFuncionario`]="{ value }">
                    <span class="text-body-2 font-weight-medium text-grey-darken-2">{{ value || 'N/A' }}</span>
                </template>

                <template #[`item.diasSemana`]="{ item }">
                    <span class="text-body-2 font-weight-medium text-grey-darken-2">
                            {{ item.diasSemana }}
                    </span>
                </template>

                <template #[`item.hoario`]="{ item }">
                    <div class="d-flex flex-column">
                        <div class="d-flex align-center text-caption text-grey">
                            {{ item.horario }}
                        </div>
                    </div>
                </template>

                <template #[`item.actions`]="{ item }">
                    <v-btn 
                        color="#ffb300" 
                        size="small" 
                        class="rounded-lg text-white font-weight-black px-4" 
                        elevation="0"
                        @click="handleMarcarPresenca(item)"
                    >
                        <v-icon start icon="mdi-account-check" size="18"></v-icon> 
                        PRESENÇA
                    </v-btn>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50 text-caption">
                        Sincronizado com a Secretaria Acadêmica • Conexus 2025
                    </div>
                </template>

                <template v-slot:loading>
                    <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<style scoped>
/* CORES E DESIGN CONEXUS #ffb300 */
.hero-conexus {
    background: linear-gradient(135deg, #ffb300 0%, #fb910a 100%) !important;
    box-shadow: 0 12px 35px rgba(251, 145, 10, 0.2) !important;
}

.text-brand {
    color: #ffb300 !important;
}

.border-l-primary {
    border-left: 4px solid #ffb300 !important;
}

.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.12);
    border-radius: 50%;
    width: 250px;
    height: 250px;
    top: -80px;
    right: -40px;
}

/* CUSTOMIZAÇÃO DA TABELA */
.custom-table :deep(thead th) {
    font-weight: 800 !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    letter-spacing: 0.5px;
    color: #455a64 !important;
    background-color: #fcfcfc !important;
}

.shadow-main {
    box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important;
}

.bg-card-sub {
    background-color: rgba(255, 179, 0, 0.03);
}

.z-index-1 { z-index: 1; }
.backdrop-blur { backdrop-filter: blur(8px); }
.shadow-soft { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
</style>