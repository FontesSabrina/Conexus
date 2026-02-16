<script setup>
import { ref, onMounted, computed } from 'vue';
import { useEmprestimoMaterialStore } from '@/stores/emprestimoMaterialStores'; 
import { useRouter } from 'vue-router';

const router = useRouter();
const emprestimoStore = useEmprestimoMaterialStore();

const busca = ref('');
const showDeleteModal = ref(false);
const emprestimoToDelete = ref(null);
const isDeleting = ref(false);

const headers = [
    { title: 'ID', key: 'idemprestimo', align: 'start' },
    { title: 'ALUNO / MATERIAL', key: 'alunoMaterial', align: 'start' }, 
    { title: 'DATA EMPRÉSTIMO', key: 'dataEmprestimo', align: 'start' },
    { title: 'PREVISÃO / DEVOLUÇÃO', key: 'prazos', align: 'start' },
    { title: 'STATUS', key: 'status', align: 'center' },
    { title: 'MULTA', key: 'valorMulta', align: 'start' },
    { title: 'AÇÕES', key: 'actions', align: 'center', sortable: false },
];

const emprestimos = computed(() => emprestimoStore.emprestimos); 
const isLoading = computed(() => emprestimoStore.isLoading); 

onMounted(() => {
    emprestimoStore.exibir(); 
});

const formatarData = (data) => {
    if (!data) return 'N/A';
    try {
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    } catch { return '---'; }
}

const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s.includes('atrasado')) return 'error';
    if (s.includes('pendente')) return 'warning';
    if (s.includes('devolvido')) return 'success';
    return 'grey';
}

function goToCadastro() {
    router.push({ name: 'CadastrarEmprestimo' });
}

function editarEmprestimo(item) {
    router.push({ name: 'EditarEmprestimo', params: { id: item.idemprestimo } });
}

function confirmDelete(item) {
    emprestimoToDelete.value = item;
    showDeleteModal.value = true;
}

async function deleteEmprestimo() {
    if (!emprestimoToDelete.value) return;
    isDeleting.value = true;
    try {
        await emprestimoStore.apagar(emprestimoToDelete.value.idemprestimo);
        showDeleteModal.value = false;
    } finally {
        isDeleting.value = false;
        emprestimoToDelete.value = null;
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
                                    <v-icon size="32">mdi-book-clock</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black mb-1">Circulação de Materiais</h1>
                                    <p class="text-subtitle-1 opacity-80 font-weight-light">Controle de empréstimos, prazos e devoluções</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="5" class="text-md-right">
                            <v-btn color="white" prepend-icon="mdi-plus" size="large" class="rounded-lg font-weight-bold text-orange-darken-4 shadow-soft" @click="goToCadastro">
                                NOVO EMPRÉSTIMO
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden bg-surface shadow-main">
            <v-toolbar flat class="bg-surface px-4 border-b">
                <v-text-field
                    v-model="busca"
                    prepend-inner-icon="mdi-magnify"
                    label="Buscar por ID, Aluno ou Status..."
                    variant="solo-filled"
                    flat hide-details density="compact"
                    class="rounded-lg" style="max-width: 400px;"
                ></v-text-field>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="emprestimos"
                :search="busca"
                :loading="isLoading"
                class="custom-table"
                hover
            >
                <template #[`item.alunoMaterial`]="{ item }">
                    <div class="d-flex flex-column py-2">
                        <span class="font-weight-black text-grey-darken-3">ID Aluno: {{ item.idaluno }}</span>
                        <span class="text-caption text-brand font-weight-bold">ID Material: {{ item.idmaterial }}</span>
                    </div>
                </template>

                <template #[`item.dataEmprestimo`]="{ value }">
                    <div class="d-flex align-center">
                        <v-icon size="16" class="mr-2 text-grey">mdi-calendar-export</v-icon>
                        <span class="text-body-2">{{ formatarData(value) }}</span>
                    </div>
                </template>

                <template #[`item.prazos`]="{ item }">
                    <div class="d-flex flex-column">
                        <span class="text-caption text-grey">Prevista: {{ formatarData(item.devolucaoPrevista) }}</span>
                        <span :class="item.dataDevolvido ? 'text-success' : 'text-error'" class="text-caption font-weight-bold">
                            Real: {{ item.dataDevolvido ? formatarData(item.dataDevolvido) : 'Pendente' }}
                        </span>
                    </div>
                </template>

                <template #[`item.status`]="{ value }">
                    <v-chip :color="getStatusColor(value)" size="x-small" variant="tonal" class="font-weight-black text-uppercase">
                        {{ value }}
                    </v-chip>
                </template>

                <template #[`item.valorMulta`]="{ value }">
                    <span :class="value > 0 ? 'text-error font-weight-bold' : 'text-grey-lighten-1'">
                        R$ {{ (value || 0).toFixed(2).replace('.', ',') }}
                    </span>
                </template>

                <template #[`item.actions`]="{ item }">
                    <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="blue" @click="editarEmprestimo(item)"></v-btn>
                    <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="confirmDelete(item)"></v-btn>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50 text-caption font-weight-bold">
                        BIBLIOTECA & ACERVO • CONEXUS 2025
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container>

    <v-dialog v-model="showDeleteModal" max-width="450">
        <v-card class="rounded-xl pa-4">
            <v-card-title class="text-error font-weight-black">Confirmar Exclusão</v-card-title>
            <v-card-text>Deseja remover o registro de empréstimo <strong>#{{ emprestimoToDelete?.idemprestimo }}</strong>?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="showDeleteModal = false">Cancelar</v-btn>
                <v-btn color="error" variant="elevated" @click="deleteEmprestimo" :loading="isDeleting">Confirmar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.hero-conexus {
    background: linear-gradient(135deg, #fb910a 0%, #e67e00 100%) !important;
}
.text-brand { color: #fb910a !important; }
.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%; width: 200px; height: 200px; top: -50px; right: -50px;
}
.custom-table :deep(thead th) {
    font-weight: 800 !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    background-color: #fcfcfc !important;
}
.bg-card-sub { background-color: rgba(251, 145, 10, 0.03); }
.shadow-soft { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
.backdrop-blur { backdrop-filter: blur(8px); }
</style>