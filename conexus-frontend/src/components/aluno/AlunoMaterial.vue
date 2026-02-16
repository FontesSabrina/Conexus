<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMaterialStore } from '@/stores/materialStore'; 

const materialStore = useMaterialStore();

// --- Estado Reativo ---
const filtroCurso = ref('Todos');
const filtroTipo = ref('Todos');

const todosOsMateriais = computed(() => materialStore.materiais);
const isLoading = computed(() => materialStore.isLoading); 

const cursosDisponiveis = computed(() => [
    'Todos', 
    ...new Set(todosOsMateriais.value.map(m => m.curso))
]);
const tiposDeMaterial = computed(() => [
    'Todos', 
    ...new Set(todosOsMateriais.value.map(m => m.tipo))
]);

// --- Lógica de Filtro ---
const materiaisFiltrados = computed(() => {
    return todosOsMateriais.value.filter(material => {
        const cursoMatch = filtroCurso.value === 'Todos' || material.curso === filtroCurso.value;
        const tipoMatch = filtroTipo.value === 'Todos' || material.tipo === filtroTipo.value;
        return cursoMatch && tipoMatch;
    });
});

// --- Funções de Ajuda Visual ---
const getCorProgresso = (progresso) => {
    if (progresso === 100) return '#43A047';
    if (progresso > 50) return '#FB8C00';
    return '#1E88E5';
};

const abrirMaterial = (link) => {
    window.open(link, '_blank');
};

onMounted(() => {
    // materialStore.exibirMateriaisDoAluno(); 
});
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-materials rounded-xl pa-8 mb-6 position-relative overflow-hidden">
                    <div class="deco-circle"></div>
                    
                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="7">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon color="white" size="32">mdi-library-shelves</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black text-white mb-1">Materiais Didáticos</h1>
                                    <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                                        Explore slides, apostilas e conteúdos complementares.
                                    </p>
                                </div>
                            </div>
                        </v-col>
                        
                        <v-col cols="12" md="5" class="d-flex flex-column flex-md-row gap-4 align-center">
                            <v-select
                                v-model="filtroCurso"
                                :items="cursosDisponiveis"
                                label="Curso"
                                variant="solo"
                                flat
                                density="comfortable"
                                class="filter-select rounded-lg w-100"
                                hide-details
                                bg-color="rgba(255,255,255,0.15)"
                                theme="dark"
                            ></v-select>
                            
                            <v-select
                                v-model="filtroTipo"
                                :items="tiposDeMaterial"
                                label="Tipo"
                                variant="solo"
                                flat
                                density="comfortable"
                                class="filter-select rounded-lg w-100"
                                hide-details
                                bg-color="rgba(255,255,255,0.15)"
                                theme="dark"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <div v-if="isLoading" class="d-flex flex-column align-center justify-center pa-12">
            <v-progress-circular indeterminate color="#26A69A" size="64" width="6"></v-progress-circular>
            <p class="mt-4 font-weight-bold opacity-60 text-uppercase">Organizando sua biblioteca...</p>
        </div>

        <v-row v-else>
            <v-col 
                v-for="material in materiaisFiltrados" 
                :key="material.id" 
                cols="12" sm="6" lg="4" xl="3"
            >
                <v-card class="material-card rounded-xl border-custom shadow-hover" @click="abrirMaterial(material.link)">
                    <v-card-text class="pa-5">
                        <div class="d-flex justify-space-between align-start mb-4">
                            <v-avatar :color="getCorProgresso(material.progresso) + '20'" size="56" class="rounded-lg">
                                <v-icon :color="getCorProgresso(material.progresso)" size="32">{{ material.icon || 'mdi-file-document' }}</v-icon>
                            </v-avatar>
                            
                            <v-progress-circular
                                :model-value="material.progresso"
                                :color="getCorProgresso(material.progresso)"
                                :size="42"
                                :width="4"
                            >
                                <span class="text-caption font-weight-black" style="font-size: 0.65rem !important;">{{ material.progresso }}%</span>
                            </v-progress-circular>
                        </div>

                        <h3 class="text-h6 font-weight-black text-truncate-2 mb-1" style="line-height: 1.2; min-height: 2.4em;">
                            {{ material.titulo }}
                        </h3>
                        
                        <div class="d-flex align-center mb-4">
                            <v-chip size="x-small" variant="tonal" class="mr-2 font-weight-bold text-uppercase" color="grey-darken-2">
                                {{ material.curso }}
                            </v-chip>
                            <v-chip size="x-small" variant="flat" class="font-weight-bold text-uppercase" :color="getCorProgresso(material.progresso) + '15'" :style="{color: getCorProgresso(material.progresso)}">
                                {{ material.tipo }}
                            </v-chip>
                        </div>

                        <v-divider class="mb-4 opacity-10"></v-divider>

                        <div class="d-flex align-center justify-space-between">
                            <span class="text-caption font-weight-bold opacity-60">Status de leitura</span>
                            <v-icon size="small" color="grey-lighten-1">mdi-arrow-right-circle</v-icon>
                        </div>
                        <v-progress-linear 
                            :model-value="material.progresso" 
                            :color="getCorProgresso(material.progresso)"
                            height="6"
                            rounded
                            class="mt-2"
                        ></v-progress-linear>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" v-if="materiaisFiltrados.length === 0 && !isLoading">
                <v-card flat class="pa-12 text-center rounded-xl border-dashed bg-surface opacity-60">
                    <v-icon size="64" class="mb-4">mdi-book-search-outline</v-icon>
                    <h3 class="text-h6 font-weight-bold">Nenhum material encontrado</h3>
                    <p>Tente ajustar os filtros de curso ou tipo acima.</p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
/* ESTILO DO BANNER (TEMA VERDE/CONEXUS) */
.hero-materials {
    background: linear-gradient(135deg, #26A69A 0%, #00695C 100%) !important;
    box-shadow: 0 10px 30px rgba(38, 166, 154, 0.3) !important;
}

.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    width: 300px;
    height: 300px;
    top: -100px;
    right: -50px;
}

/* CUSTOMIZAÇÃO DOS FILTROS DENTRO DO BANNER */
.filter-select :deep(.v-field) {
    border-radius: 12px !important;
    backdrop-filter: blur(10px);
}

.filter-select :deep(.v-label) {
    color: white !important;
    font-weight: bold;
}

/* CARDS DE MATERIAL */
.material-card {
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
    background-color: rgb(var(--v-theme-surface));
    border: 1px solid rgba(var(--v-border-color), 0.08) !important;
}

.shadow-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
    border-color: #26A69A !important;
}

.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.border-dashed {
    border: 2px dashed rgba(var(--v-border-color), 0.2) !important;
}

.gap-4 { gap: 16px; }
.z-index-1 { z-index: 1; }
.backdrop-blur { backdrop-filter: blur(10px); }
</style>