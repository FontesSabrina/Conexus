<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores';
import { useTurmaStore } from '@/stores/turmaStore';
import { useAuthStore } from '@/stores/authStore'; 

const router = useRouter(); 
const authStore = useAuthStore();
const calendarioStore = useCalendarioAulaStore();
const turmaStore = useTurmaStore();

onMounted(async () => {
    await calendarioStore.exibir(); 
    await turmaStore.exibir(); 
});

const primeiroNome = computed(() => {
    const nomeCompleto = authStore.user?.nome || 'Professor(a)';
    return nomeCompleto.split(' ')[0];
});

const dataAtual = computed(() => {
    return new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
});

const routes = {
    turmas: '/professor/turmas', 
    lancarNotas: '/professor/lancamento-notas', 
    gerenciarMateriais: '/professor/materiais', 
    calendario: '/professor/calendario' 
};

function goTo(path) {
    router.push(path); 
}
</script>

<template>
    <v-container fluid class="pa-6 fill-height align-start bg-background">
        
        <v-row>
            <v-col cols="12" class="mb-6">
                <v-card 
                    flat 
                    class="rounded-xl pa-8 hero-professor d-flex flex-column justify-center position-relative overflow-hidden"
                    min-height="180"
                >
                    <div class="deco-circle circle-1"></div>
                    <div class="deco-circle circle-2"></div>

                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center mb-2">
                                <v-avatar size="48" color="rgba(255,255,255,0.2)" class="mr-4 shadow-light">
                                    <v-icon color="white">mdi-presentation</v-icon>
                                </v-avatar>
                                <h1 class="text-h3 font-weight-black text-white">
                                    E aí, {{ primeiroNome }}! 🚀
                                </h1>
                            </div>
                            <p class="text-h6 text-white font-weight-light opacity-80 ms-1">
                                Sua sala de aula virtual **Conexus** está organizada e pronta para inspirar seus alunos.
                            </p>
                        </v-col>
                        
                        <v-col cols="12" md="4" class="text-md-right mt-4 mt-md-0">
                            <v-chip 
                                color="rgba(255,255,255,0.2)" 
                                label 
                                class="text-white backdrop-blur px-6 py-5 rounded-lg border-white-thin shadow-light"
                            >
                                <v-icon start icon="mdi-calendar-check" class="mr-2"></v-icon>
                                <span class="text-subtitle-1 font-weight-bold">
                                    {{ dataAtual }}
                                </span>
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-2">
            <v-col cols="12" sm="6" md="3">
                <v-card flat border class="card-acao rounded-xl pa-8 text-center bg-surface shadow-hover" @click="goTo(routes.turmas)">
                    <v-avatar color="orange-lighten-5" size="70" class="mb-4">
                        <v-icon color="#ffb300" size="35">mdi-account-group-outline</v-icon>
                    </v-avatar>
                    <h3 class="text-h6 font-weight-bold title-custom">Minhas Turmas</h3>
                    <p class="text-caption text-medium-emphasis">Gestão de alunos e turmas</p>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card flat border class="card-acao rounded-xl pa-8 text-center bg-surface shadow-hover" @click="goTo(routes.lancarNotas)">
                    <v-avatar color="orange-lighten-5" size="70" class="mb-4">
                        <v-icon color="#ffb300" size="35">mdi-notebook-edit-outline</v-icon>
                    </v-avatar>
                    <h3 class="text-h6 font-weight-bold title-custom">Lançar Notas</h3>
                    <p class="text-caption text-medium-emphasis">Avaliações e frequências</p>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card flat border class="card-acao rounded-xl pa-8 text-center bg-surface shadow-hover" @click="goTo(routes.gerenciarMateriais)">
                    <v-avatar color="orange-lighten-5" size="70" class="mb-4">
                        <v-icon color="#ffb300" size="35">mdi-cloud-upload-outline</v-icon>
                    </v-avatar>
                    <h3 class="text-h6 font-weight-bold title-custom">Materiais</h3>
                    <p class="text-caption text-medium-emphasis">Slides e documentos</p>
                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
                <v-card flat border class="card-acao rounded-xl pa-8 text-center bg-surface shadow-hover" @click="goTo(routes.calendario)">
                    <v-avatar color="orange-lighten-5" size="70" class="mb-4">
                        <v-icon color="#ffb300" size="35">mdi-calendar-multiselect</v-icon>
                    </v-avatar>
                    <h3 class="text-h6 font-weight-bold title-custom">Calendário</h3>
                    <p class="text-caption text-medium-emphasis">Horários e eventos</p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* Efeito de Luz (Glow) mais intenso para o Professor */
.hero-professor {
    background: linear-gradient(135deg, #ffb300 0%, #e65100 100%) !important;
    /* Essa é a "luz" que brilha no modo escuro */
    box-shadow: 0 10px 40px rgba(255, 179, 0, 0.45) !important;
}

.shadow-light {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.backdrop-blur {
    backdrop-filter: blur(12px);
    background-color: rgba(255, 255, 255, 0.15) !important;
}

/* Elementos decorativos circulares */
.deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}
.circle-1 {
    width: 320px;
    height: 320px;
    top: -160px;
    right: -60px;
}
.circle-2 {
    width: 180px;
    height: 180px;
    bottom: -90px;
    left: 8%;
}

.z-index-1 { z-index: 1; }
.border-white-thin { border: 1px solid rgba(255, 255, 255, 0.3) !important; }

/* Título dinâmico para modo escuro */
.title-custom {
    color: rgb(var(--v-theme-on-surface));
}

.card-acao {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    border-color: rgba(var(--v-border-color), 0.12) !important;
}

.card-acao:hover {
    transform: translateY(-10px);
    border-color: #ffb300 !important;
    box-shadow: 0 15px 35px rgba(255, 179, 0, 0.15) !important;
}

.card-acao:hover h3 {
    color: #ffb300 !important;
}
</style>