<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMaterialStore } from '@/stores/materialStore';
import { useTurmaStore } from '@/stores/turmaStore';
import MaterialForm from '@/components/professor/MaterialForm.vue';

const materialStore = useMaterialStore();
const turmaStore = useTurmaStore();

const turmasDoProfessor = computed(() => turmaStore.turmas || []);
const materiais = computed(() => materialStore.materiais || []);

const isLoading = ref(false); 
const dialogCadastrar = ref(false);

const materialForm = ref({
    idmaterial: null,
    titulo: '',
    descricao: '',
    idtipoMaterial: null,
    idioma: '',
    nivel: null, 
    link: '',
    idturma: null, 
});

const headers = ref([
    { title: 'MATERIAL / DESCRIÇÃO', align: 'start', key: 'titulo', width: '40%' }, 
    { title: 'IDIOMA', align: 'center', key: 'idiomaDescricao' },
    { title: 'NÍVEL', align: 'center', key: 'nivelDescricao' },
    { title: 'CATEGORIA', align: 'center', key: 'tipoMaterialDescricao' },
    { title: 'AÇÕES', align: 'center', key: 'actions', sortable: false },
]);

async function fetchMateriais() {
    isLoading.value = true;
    try {
        await Promise.all([materialStore.exibir(), turmaStore.exibir()]);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    materialForm.value = { idmaterial: null, titulo: '', descricao: '', tipo: null, idioma: '', nivel: null, link: '', idturma: null };
}

function novoMaterial() {
    resetForm();
    dialogCadastrar.value = true;
}

function editItem(item) {
    materialForm.value = { ...item }; 
    dialogCadastrar.value = true;
}

async function deleteItem(item) {
    if (confirm(`Tem certeza que deseja apagar o material "${item.titulo}"?`)) {
        try { await materialStore.apagar(item.idmaterial); } 
        catch (error) { console.error("Erro:", error); }
    }
}

async function salvarMaterial(formData) {
    try {
        if (formData.idmaterial) await materialStore.editar(formData); 
        else await materialStore.adicionar(formData);
        dialogCadastrar.value = false; 
    } catch (error) { console.error("Erro:", error); } 
}

onMounted(() => fetchMateriais());
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
                                    <v-icon color="white" size="32">mdi-folder-open</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black text-white mb-1">Materiais Didáticos</h1>
                                    <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                                        Gerencie seus arquivos, links e referências acadêmicas
                                    </p>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" md="5" class="text-md-right">
                            <v-btn
                                color="white"
                                prepend-icon="mdi-plus"
                                variant="elevated"
                                size="large"
                                class="rounded-lg font-weight-bold text-amber-darken-4 px-6 shadow-soft"
                                @click="novoMaterial"
                            >
                                CADASTRAR MATERIAL
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4" v-if="!isLoading">
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main border-l-primary">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Total de Materiais</div>
                    <div class="text-h5 font-weight-black text-brand">{{ materiais.length }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
                    <div class="text-caption font-weight-bold text-grey text-uppercase">Turmas Vinculadas</div>
                    <div class="text-h5 font-weight-black">
                        {{ turmasDoProfessor.length }}
                    </div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
                    <div class="text-caption font-weight-bold text-grey text-uppercase">Data Atual</div>
                    <div class="text-h6 font-weight-bold">
                        {{ new Date().toLocaleDateString() }}
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden shadow-main bg-surface">
            <v-data-table
                v-if="!isLoading"
                :headers="headers"
                :items="materiais"
                class="custom-table"
                hover
            >
                <template #[`item.titulo`]="{ item }">
                    <div class="d-flex align-center py-3">
                        <v-avatar size="32" color="rgba(255, 179, 0, 0.1)" class="mr-3">
                            <v-icon color="#ffb300" size="18">mdi-file-document-outline</v-icon>
                        </v-avatar>
                        <div class="d-flex flex-column">
                            <span class="font-weight-black text-grey-darken-3">{{ item.titulo }}</span>
                            <span class="text-caption text-grey-darken-1 text-truncate" style="max-width: 350px;">
                                {{ item.descricao || 'Sem descrição cadastrada' }}
                            </span>
                        </div>
                    </div>
                </template>

                <template #[`item.idiomaDescricao`]="{ value }">
                    <v-chip size="small" variant="tonal" color="#ffb300" class="font-weight-black px-4" rounded="lg">
                        {{ value || 'N/A' }}
                    </v-chip>
                </template>

                <template #[`item.actions`]="{ item }">
                    <div class="d-flex justify-center">
                        <v-btn v-if="item.link" icon="mdi-open-in-new" variant="text" size="small" color="blue" :href="item.link" target="_blank"></v-btn>
                        <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="#ffb300" @click="editItem(item)"></v-btn>
                        <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="deleteItem(item)"></v-btn>
                    </div>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50 text-caption">
                        Sincronizado com o sistema acadêmico • Conexus 2025
                    </div>
                </template>
            </v-data-table>

            <div v-else class="pa-12 text-center">
                <v-progress-circular indeterminate color="#ffb300" size="50"></v-progress-circular>
            </div>
        </v-card>

        <v-dialog v-model="dialogCadastrar" max-width="700px" persistent transition="dialog-bottom-transition">
            <v-card class="rounded-xl overflow-hidden">
                <v-toolbar color="#ffb300" flat>
                    <v-icon color="white" class="ml-4">mdi-plus-circle</v-icon>
                    <v-toolbar-title class="text-white font-weight-bold">Gerenciar Material</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" color="white" @click="dialogCadastrar = false"></v-btn>
                </v-toolbar>
                <v-card-text class="pa-6">
                    <MaterialForm 
                        v-if="dialogCadastrar" 
                        v-model="materialForm" 
                        :turmasDisponiveis="turmasDoProfessor" 
                        @save="salvarMaterial" 
                        @close="dialogCadastrar = false" 
                    />
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
/* CORES DO TEMA #ffb300 */
.hero-conexus {
    background: linear-gradient(135deg, #ffb300 0%, #fb910a 100%) !important;
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

.custom-table :deep(thead th) {
    font-weight: 800 !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    letter-spacing: 0.5px;
    color: #455a64 !important;
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