<script setup>
import { computed } from 'vue';

const alunoName = computed(() => 'Aluno(a)');

const acoesRapidas = [
    // Ícone alterado para mdi-school para garantir visibilidade e clareza
    { title: 'Minhas Aulas', icon: 'mdi-school', to: '/aluno/minhaaulas', desc: 'Horários e links' },
    { title: 'Materiais', icon: 'mdi-folder-open', to: '/aluno/materiais', desc: 'Arquivos e slides' },
    { title: 'Boletim', icon: 'mdi-file-chart', to: '/aluno/boletim', desc: 'Notas e frequências' },
    { title: 'Financeiro', icon: 'mdi-credit-card-outline', to: '/aluno/financeiro', desc: 'Mensalidades' }
];
</script>

<template>
    <v-container fluid class="pa-6 fill-height align-start">
        <v-row>
            <v-col cols="12" class="mb-6">
                <v-card 
                    flat 
                    class="rounded-xl pa-8 hero-gradient d-flex flex-column justify-center position-relative overflow-hidden"
                    min-height="180"
                >
                    <div class="deco-circle circle-1"></div>
                    <div class="deco-circle circle-2"></div>

                    <v-row align="center" class="position-relative">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center mb-2">
                                <v-badge dot color="success" class="mr-3" bordered>
                                    <v-avatar size="48" color="white" class="elevation-2">
                                        <v-icon color="#2FA99E">mdi-account-circle</v-icon>
                                    </v-avatar>
                                </v-badge>
                                <h1 class="text-h3 font-weight-black text-white">
                                    E aí, {{ alunoName }}! 🚀
                                </h1>
                            </div>
                            <p class="text-h6 text-white font-weight-light opacity-80 ms-1">
                                O seu universo de conhecimento **Conexus** está pronto para ser explorado.
                            </p>
                        </v-col>
                        
                        <v-col cols="12" md="4" class="text-md-right mt-4 mt-md-0">
                            <v-chip 
                                color="rgba(255,255,255,0.2)" 
                                label 
                                class="text-white backdrop-blur px-6 py-5 rounded-lg"
                            >
                                <v-icon start icon="mdi-calendar-check" class="mr-2"></v-icon>
                                <span class="text-subtitle-1 font-weight-bold">
                                    {{ new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) }}
                                </span>
                            </v-chip>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-row dense>
                    <v-col v-for="acao in acoesRapidas" :key="acao.title" cols="12" sm="6" md="3">
                        <v-card :to="acao.to" flat class="text-center pa-6 rounded-xl hover-card border-custom">
                            <v-avatar color="#2FA99E" variant="tonal" size="64" class="mb-4">
                                <v-icon :icon="acao.icon" size="32" color="#2FA99E"></v-icon>
                            </v-avatar>
                            <div class="text-h6 font-weight-bold title-custom">{{ acao.title }}</div>
                            <div class="text-body-2 text-medium-emphasis">{{ acao.desc }}</div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* Gradiente moderno usando sua cor principal #2FA99E */
.hero-gradient {
    background: linear-gradient(135deg, #2FA99E 0%, #1a5a54 100%) !important;
    box-shadow: 0 10px 30px rgba(47, 169, 158, 0.3) !important;
}

/* Efeito de desfoque no fundo do chip de data */
.backdrop-blur {
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

/* Elementos decorativos abstratos */
.deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}
.circle-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -50px;
}
.circle-2 {
    width: 150px;
    height: 150px;
    bottom: -70px;
    left: 10%;
}

.opacity-80 {
    opacity: 0.8;
}

/* Ajustes para Modo Escuro nos demais cards */
.title-custom {
    color: rgb(var(--v-theme-on-surface));
}
.border-custom {
    border: 1px solid rgba(var(--v-border-color), 0.12) !important;
}
.hover-card {
    transition: all 0.3s ease-in-out;
    background-color: rgb(var(--v-theme-surface));
}
.hover-card:hover {
    border-color: #2FA99E !important;
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2) !important;
}
</style>