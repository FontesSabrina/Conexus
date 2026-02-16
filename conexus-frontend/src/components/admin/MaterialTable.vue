<script setup>
import { ref, onMounted, computed } from 'vue';
import { useMaterialStore } from '@/stores/materialStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const materialStore = useMaterialStore();

const busca = ref('');
const showDeleteModal = ref(false);
const materialToDelete = ref(null);
const isDeleting = ref(false);

// Definição das colunas simplificada para o padrão nativo do Vuetify
const headers = [
    { title: 'TÍTULO DO MATERIAL', key: 'titulo', align: 'start' },
    { title: 'CATEGORIA', key: 'tipoMaterial', align: 'start' },
    { title: 'IDIOMA / NÍVEL', key: 'idiomaNivel', align: 'start' },
    { title: 'ESTOQUE', key: 'quantidade', align: 'center' },
    { title: 'CADASTRO', key: 'dataCadastro', align: 'start' },
    { title: 'AÇÕES', key: 'actions', align: 'center', sortable: false },
];

const materiais = computed(() => materialStore.materiais);
const isLoading = computed(() => materialStore.isLoading);

// Cálculo do total de itens em estoque para o card de indicadores
const totalEstoque = computed(() => {
    return materiais.value.reduce((acc, curr) => acc + (Number(curr.quantidade) || 0), 0);
});

onMounted(() => {
    materialStore.exibir();
});

function goToCadastro() {
    router.push({ name: 'CadastrarMaterial' });
}

function editarMaterial(item) {
    router.push({ name: 'EditarMaterial', params: { id: item.idmaterial } });
}

function confirmDelete(item) {
    materialToDelete.value = item;
    showDeleteModal.value = true;
}

async function deleteMaterial() {
    if (!materialToDelete.value) return;
    isDeleting.value = true;
    try {
        const sucesso = await materialStore.apagarMaterial(materialToDelete.value.idmaterial);
        if (sucesso) showDeleteModal.value = false;
    } finally {
        isDeleting.value = false;
        materialToDelete.value = null;
    }
}
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-conexus rounded-xl pa-8 mb-6 position-relative overflow-hidden">
                    <div class="deco-circle"></div>
                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="7">
                            <div class="d-flex align-center text-white">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon size="32">mdi-book-open-page-variant</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black mb-1">Materiais Didáticos</h1>
                                    <p class="text-subtitle-1 opacity-80 font-weight-light">Gestão de acervo, livros e recursos educacionais</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="5" class="text-md-right">
                            <v-btn 
                                color="white" 
                                prepend-icon="mdi-plus" 
                                size="large" 
                                class="rounded-lg font-weight-bold text-orange-darken-4 shadow-soft" 
                                @click="goToCadastro"
                            >
                                NOVO MATERIAL
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4" v-if="!isLoading">
            <v-col cols="12" sm="4" md="3">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-brand">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Títulos Registrados</div>
                    <div class="text-h5 font-weight-black text-brand">{{ materiais.length }}</div>
                </v-card>
            </v-col>
            <v-col cols="12" sm="4" md="3">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-blue">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Itens em Estoque</div>
                    <div class="text-h5 font-weight-black text-blue-darken-2">{{ totalEstoque }}</div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden bg-surface shadow-main">
            <v-toolbar flat class="bg-surface px-4 border-b">
                <v-text-field
                    v-model="busca"
                    prepend-inner-icon="mdi-magnify"
                    label="Pesquisar material..."
                    variant="solo-filled"
                    flat hide-details density="compact"
                    class="rounded-lg" style="max-width: 400px;"
                ></v-text-field>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="materiais"
                :search="busca"
                :loading="isLoading"
                class="custom-table"
                hover
            >
                <template #[`item.titulo`]="{ item }">
                    <div class="d-flex align-center py-3">
                        <v-icon color="#fb910a" size="20" class="mr-3">mdi-bookmark-outline</v-icon>
                        <span class="font-weight-black text-grey-darken-3">{{ item.titulo }}</span>
                    </div>
                </template>

                <template #[`item.tipoMaterial`]="{ item }">
                    <v-chip size="x-small" variant="outlined" color="grey-darken-1" class="font-weight-bold">
                        {{ item.tipoMaterial?.descricao || 'N/A' }}
                    </v-chip>
                </template>

                <template #[`item.idiomaNivel`]="{ item }">
                    <div class="d-flex flex-column">
                        <span class="text-body-2 font-weight-bold text-brand">{{ item.idioma?.descricao || 'N/A' }}</span>
                        <span class="text-caption text-grey">{{ item.nivel?.descricao || 'N/A' }}</span>
                    </div>
                </template>

                <template #[`item.quantidade`]="{ value }">
                    <v-chip 
                        :color="value < 5 ? 'error' : 'success'" 
                        size="small" 
                        variant="tonal" 
                        class="font-weight-black"
                    >
                        {{ value }} un
                    </v-chip>
                </template>

                <template #[`item.dataCadastro`]="{ value }">
                    <span class="text-caption text-grey-darken-1">
                        {{ value ? new Date(value).toLocaleDateString('pt-BR') : 'N/A' }}
                    </span>
                </template>

                <template #[`item.actions`]="{ item }">
                    <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="blue-darken-2" @click="editarMaterial(item)"></v-btn>
                    <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="confirmDelete(item)"></v-btn>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50 text-caption font-weight-bold">
                        LOGÍSTICA & MATERIAIS • CONEXUS 2025
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container>

    <v-dialog v-model="showDeleteModal" max-width="450">
        <v-card class="rounded-xl pa-4">
            <v-card-title class="d-flex align-center text-error font-weight-black">
                <v-icon start color="error">mdi-alert-circle</v-icon>
                Confirmar Exclusão
            </v-card-title>
            <v-card-text class="text-body-1 py-4">
                Tem certeza que deseja excluir o material <strong class="text-grey-darken-3">{{ materialToDelete?.titulo }}</strong>?
                Isso removerá o item permanentemente do acervo.
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" class="rounded-lg font-weight-bold" @click="showDeleteModal = false">CANCELAR</v-btn>
                <v-btn color="error" variant="elevated" class="rounded-lg font-weight-bold px-6" @click="deleteMaterial" :loading="isDeleting">
                    EXCLUIR
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.hero-conexus {
    background: linear-gradient(135deg, #fb910a 0%, #e67e00 100%) !important;
    box-shadow: 0 12px 35px rgba(251, 145, 10, 0.25) !important;
}

.text-brand { color: #fb910a !important; }
.border-l-brand { border-left: 4px solid #fb910a !important; }
.border-l-blue { border-left: 4px solid #1976D2 !important; }

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
    letter-spacing: 0.8px;
    color: #546e7a !important;
    background-color: #fcfcfc !important;
    border-bottom: 2px solid #f0f0f0 !important;
}

.shadow-main { box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important; }
.bg-card-sub { background-color: rgba(251, 145, 10, 0.03); }
.z-index-1 { z-index: 1; }
.backdrop-blur { backdrop-filter: blur(8px); }
.shadow-soft { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }

.custom-table :deep(tr:hover) {
    background-color: rgba(251, 145, 10, 0.02) !important;
}
</style>