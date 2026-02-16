<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

// Stores necessárias
import { useTurmaStore } from '@/stores/turmaStore'; 
import { useIdiomaStore } from '@/stores/idiomaStores'; 
import { useNivelStore } from '@/stores/nivelStores'; 
import { useFuncionarioStore } from '@/stores/funcionarioStore'; 

const router = useRouter();
const turmaStore = useTurmaStore(); 
const idiomaStore = useIdiomaStore(); 
const nivelStore = useNivelStore(); 
const funcionarioStore = useFuncionarioStore(); 

const isLoading = ref(true);
const busca = ref('');

// Confirmação de exclusão
const showDeleteModal = ref(false);
const turmaToDelete = ref(null);
const isDeleting = ref(false);

const turmasFormatadas = computed(() => {
    if (!turmaStore.turmas.length) return [];

    return turmaStore.turmas.map(item => {
        const idiomaDescricao = idiomaStore.idiomas.find(i => i.ididioma === item.iddisciplina)?.descricao || 'N/A';
        const nivelDescricao = nivelStore.niveis.find(n => n.idnivel === item.idnivel)?.descricao || 'N/A';
        const professor = funcionarioStore.funcionarios.find(f => f.idfuncionario === item.idfuncionario)?.nome || 'Não Atribuído';
        const horaFormatada = item.horainicio ? item.horainicio.substring(0, 5) : 'N/A';
            
        return {
            id: item.idturma,
            descricaoTurma: item.descricaoTurma,
            idioma: item.idioma,
            nivel: item.nivel,
            professor: item.professor,
            sala: item.sala || 'N/A',
            diassemana: item.diassemana, 
            horario: item.horario,
        };
    });
});

const headers = ref([
    { title: 'TURMA / SALA', align: 'start', key: 'descricaoTurma' },
    { title: 'IDIOMA / NÍVEL', align: 'start', key: 'idioma' },
    { title: 'PROFESSOR', align: 'start', key: 'professor' },
    { title: 'HORÁRIO', align: 'start', key: 'horario' },
    { title: 'AÇÕES', align: 'center', key: 'actions', sortable: false }, 
]);

function editTurma(item) {
    router.push(`/admin/turmas/novo/${item.id}`);
}

function confirmDelete(item) {
    turmaToDelete.value = item;
    showDeleteModal.value = true;
}

async function deleteTurma() {
    if (turmaToDelete.value?.id) {
        isDeleting.value = true;
        const sucesso = await turmaStore.apagar(turmaToDelete.value.id);
        if (sucesso) showDeleteModal.value = false;
        isDeleting.value = false;
    }
}

function addNewTurma() {
    router.push('/admin/turmas/novo');
}

onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([
            turmaStore.exibir(),
            idiomaStore.exibir(),
            nivelStore.exibir(),
            funcionarioStore.exibir(),
        ]);
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
                        <v-col cols="12" md="7">
                            <div class="d-flex align-center text-white">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur">
                                    <v-icon size="32">mdi-domain</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black mb-1 text-uppercase">Gestão de Turmas</h1>
                                    <p class="text-subtitle-1 opacity-80 font-weight-light">Configurações e cronogramas acadêmicos</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="5" class="text-md-right">
                            <v-btn color="white" prepend-icon="mdi-plus" size="large" class="rounded-lg font-weight-bold text-orange-darken-4" @click="addNewTurma">
                                CADASTRAR TURMA
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4">
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-brand">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Turmas Ativas</div>
                    <div class="text-h5 font-weight-black text-brand">{{ turmasFormatadas.length }}</div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden bg-surface shadow-main">
            <v-toolbar flat class="bg-surface px-4 border-b">
                <v-text-field
                    v-model="busca"
                    prepend-inner-icon="mdi-magnify"
                    label="Filtrar turmas..."
                    variant="solo-filled"
                    flat hide-details density="compact"
                    class="rounded-lg" style="max-width: 400px;"
                ></v-text-field>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="turmasFormatadas"
                :search="busca"
                :loading="isLoading"
                class="custom-table"
                hover
            >
                <template #[`item.descricaoTurma`]="{ item }">
                    <div class="d-flex align-center py-3">
                        <v-avatar size="32" color="rgba(251, 145, 10, 0.1)" class="mr-3">
                            <v-icon color="#fb910a" size="18">mdi-school</v-icon>
                        </v-avatar>
                        <div class="d-flex flex-column">
                            <span class="font-weight-black text-grey-darken-3">{{ item.descricaoTurma }}</span>
                            <span class="text-caption text-grey">Sala: {{ item.sala }}</span>
                        </div>
                    </div>
                </template>

                <template #[`item.idioma`]="{ item }">
                    <div class="d-flex flex-column">
                        <v-chip size="x-small" color="#fb910a" variant="tonal" class="font-weight-black mb-1" style="max-width: fit-content">
                            {{ item.idioma }}
                        </v-chip>
                        <span class="text-caption text-grey">{{ item.nivel }}</span>
                    </div>
                </template>

                <template #[`item.actions`]="{ item }">
                    <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="blue" @click="editTurma(item)"></v-btn>
                    <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="confirmDelete(item)"></v-btn>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50 text-caption">
                        Sincronizado com a secretaria • Conexus 2025
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container> <v-dialog v-model="showDeleteModal" max-width="450">
        <v-card class="rounded-xl pa-4">
            <v-card-title class="text-error font-weight-black">Confirmar Exclusão</v-card-title>
            <v-card-text>Deseja excluir a turma <strong>{{ turmaToDelete?.descricaoTurma }}</strong>?</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="showDeleteModal = false">Cancelar</v-btn>
                <v-btn color="error" variant="elevated" @click="deleteTurma" :loading="isDeleting">Excluir</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
.hero-conexus {
    background: linear-gradient(135deg, #fb910a 0%, #e67e00 100%) !important;
}
.text-brand { color: #fb910a !important; }
.border-l-brand { border-left: 4px solid #fb910a !important; }
.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    width: 200px;
    height: 200px;
    top: -50px;
    right: -50px;
}
.custom-table :deep(thead th) {
    font-weight: 800 !important;
    text-transform: uppercase !important;
    font-size: 0.7rem !important;
    background-color: #fcfcfc !important;
}
.bg-card-sub { background-color: rgba(251, 145, 10, 0.03); }
.backdrop-blur { backdrop-filter: blur(8px); }
</style>