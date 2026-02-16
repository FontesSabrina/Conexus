<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'; 

const authStore = useAuthStore();

const adminName = computed(() => {
    const nomeCompleto = authStore.user?.nome || 'Administrador';
    return nomeCompleto.split(' ')[0];
});

const dataAtual = computed(() => {
    return new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
});

const acoesAdmin = [
    { title: 'Novo Empréstimo', icon: 'mdi-plus-box', to: '/admin/emprestimos/cadastro' },
    { title: 'Matricular Aluno', icon: 'mdi-account-plus', to: '/admin/alunos/cadastro' },
    { title: 'Nova Turma', icon: 'mdi-school', to: '/admin/turmas/nova' },
    { title: 'Adicionar Material', icon: 'mdi-package-variant-plus', to: '/admin/materiais/cadastro' },
    { title: 'Relatório Financeiro', icon: 'mdi-cash-register', to: '/admin/reports/finance' },
    { title: 'Relatório Materiais', icon: 'mdi-file-chart', to: '/admin/reports/materials' }
];
</script>

<template>
    <v-container fluid class="pa-6 fill-height align-start bg-background">
        
        <v-row>
            <v-col cols="12" class="mb-6">
                <v-card flat class="hero-admin rounded-xl pa-8 d-flex flex-column justify-center position-relative overflow-hidden">
                    <div class="deco-circle circle-1"></div>
                    <div class="deco-circle circle-2"></div>

                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center mb-2">
                                <v-avatar size="48" color="rgba(255,255,255,0.2)" class="mr-4 shadow-light">
                                    <v-icon color="white">mdi-shield-crown-outline</v-icon>
                                </v-avatar>
                                <h1 class="text-h3 font-weight-black text-white">
                                    E aí, {{ adminName }}! 🛠️
                                </h1>
                            </div>
                            <p class="text-h6 text-white font-weight-light opacity-80 ms-1">
                                O centro de controle administrativo **Conexus** está pronto.
                            </p>
                        </v-col>
                        
                        <v-col cols="12" md="4" class="text-md-right mt-4 mt-md-0">
                            <v-chip color="rgba(0,0,0,0.15)" label class="text-white backdrop-blur px-6 py-5 rounded-lg border-white-thin shadow-light">
                                <v-icon start icon="mdi-calendar-star" class="mr-2"></v-icon>
                                <span class="text-subtitle-1 font-weight-bold">{{ dataAtual }}</span>
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="acao in acoesAdmin" :key="acao.title" cols="12" sm="6" md="4" lg="2">
                <v-card flat border class="card-acao rounded-xl pa-6 text-center bg-surface shadow-hover" :to="acao.to">
                    <v-avatar color="orange-lighten-5" size="64" class="mb-4">
                        <v-icon color="#fb910a" size="32">{{ acao.icon }}</v-icon>
                    </v-avatar>
                    <div class="text-subtitle-1 font-weight-bold title-custom leading-tight">{{ acao.title }}</div>
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>

<style scoped>
.hero-admin {
    background: linear-gradient(135deg, #fb910a 0%, #d47a08 100%) !important;
    box-shadow: 0 10px 40px rgba(251, 145, 10, 0.45) !important;
}

.shadow-light {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.backdrop-blur {
    backdrop-filter: blur(12px);
    background-color: rgba(255, 255, 255, 0.1) !important;
}

.deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}
.circle-1 { width: 300px; height: 300px; top: -150px; right: -50px; }
.circle-2 { width: 150px; height: 150px; bottom: -70px; left: 8%; }

.z-index-1 { z-index: 1; }
.border-white-thin { border: 1px solid rgba(255, 255, 255, 0.2) !important; }

.card-acao {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;
    border-color: rgba(var(--v-border-color), 0.12) !important;
}

.card-acao:hover {
    transform: translateY(-8px);
    border-color: #fb910a !important;
    box-shadow: 0 15px 30px rgba(251, 145, 10, 0.15) !important;
}

.card-acao:hover .title-custom {
    color: #fb910a !important;
}

.title-custom {
    color: rgb(var(--v-theme-on-surface));
}

.leading-tight {
    line-height: 1.2;
}
</style>