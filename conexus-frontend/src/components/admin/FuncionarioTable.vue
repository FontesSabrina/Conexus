<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    import { useFuncionarioStore } from '@/stores/funcionarioStore'; 

    const router = useRouter();
    const funcionarioStore = useFuncionarioStore();

    const busca = ref('');
    const showDeleteModal = ref(false);
    const funcionarioToDelete = ref(null);
    const isDeleting = ref(false);

    const headers = [
        { title: 'NOME DO COLABORADOR', key: 'nomeUsuario', align: 'start' },
        { title: 'CPF', key: 'cpf', align: 'start' },
        { title: 'CARGO', key: 'cargo', align: 'start' },
        { title: 'AÇÕES', key: 'actions', align: 'center', sortable: false },
    ];

    const isLoading = computed(() => funcionarioStore.isLoading); 

    onMounted(async () => {
        await funcionarioStore.exibir();
    });

    function addNewFuncionario() {
        router.push({ name: 'FuncionarioRegister' });
    }

    function editFuncionario(item) {
        router.push({ name: 'FuncionarioEdit', params: { id: item.id } });
    }

    function confirmDelete(item) {
        funcionarioToDelete.value = item;
        showDeleteModal.value = true;
    }

    async function deleteFuncionario() {
        if (funcionarioToDelete.value?.id) {
            isDeleting.value = true;
            const sucesso = await funcionarioStore.apagarFuncionario(funcionarioToDelete.value.id);
            if (sucesso) showDeleteModal.value = false;
            isDeleting.value = false;
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
                                    <v-icon size="32">mdi-account-tie</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black mb-1">Equipe</h1>
                                    <p class="text-subtitle-1 opacity-80 font-weight-light">Gestão de colaboradores e permissões de acesso</p>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="5" class="text-md-right">
                            <v-btn 
                                color="white" 
                                prepend-icon="mdi-plus" 
                                size="large" 
                                class="rounded-lg font-weight-bold text-orange-darken-4 shadow-soft" 
                                @click="addNewFuncionario"
                            >
                                NOVO FUNCIONÁRIO
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mb-4" v-if="!isLoading">
            <v-col cols="12" sm="4">
                <v-card flat border class="rounded-xl pa-4 bg-surface border-l-brand">
                    <div class="text-caption font-weight-bold opacity-60 text-uppercase">Total de Colaboradores</div>
                    <div class="text-h5 font-weight-black text-brand">{{ funcionarioStore.funcionarios.length }}</div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden bg-surface shadow-main">
            <v-toolbar flat class="bg-surface px-4 border-b">
                <v-text-field
                    v-model="busca"
                    prepend-inner-icon="mdi-magnify"
                    label="Pesquisar por nome ou CPF..."
                    variant="solo-filled"
                    flat hide-details density="compact"
                    class="rounded-lg" style="max-width: 400px;"
                ></v-text-field>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="funcionarioStore.funcionarios"
                :search="busca"
                :loading="isLoading"
                class="custom-table"
                hover
                no-data-text="Nenhum funcionário cadastrado."
            >
                <template #[`item.nomeUsuario`]="{ item }">
                    <div class="d-flex align-center py-3">
                        <v-avatar size="36" color="rgba(251, 145, 10, 0.1)" class="mr-3">
                            <v-icon color="#fb910a" size="20">mdi-account</v-icon>
                        </v-avatar>
                        <span class="font-weight-black text-grey-darken-3">{{ item.nomeUsuario }}</span>
                    </div>
                </template>

                <template #[`item.cpf`]="{ value }">
                    <span class="text-body-2 font-weight-medium text-grey-darken-1">{{ value }}</span>
                </template>

                <template #[`item.cargo`]="{ value }">
                    <v-chip size="x-small" color="#fb910a" variant="tonal" class="font-weight-black">
                        {{ value || 'Colaborador' }}
                    </v-chip>
                </template>

                <template #[`item.actions`]="{ item }">
                    <div class="d-flex justify-center">
                        <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="blue-darken-2" class="mr-1" @click="editFuncionario(item)"></v-btn>
                        <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="confirmDelete(item)"></v-btn>
                    </div>
                </template>

                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="pa-4 bg-card-sub text-center opacity-50 text-caption font-weight-bold">
                        RH & ACESSOS • CONEXUS 2025
                    </div>
                </template>
            </v-data-table>
        </v-card>
    </v-container>

    <v-dialog v-model="showDeleteModal" max-width="450">
        <v-card class="rounded-xl pa-4">
            <v-card-title class="d-flex align-center text-error font-weight-black">
                <v-icon start color="error">mdi-alert-octagon</v-icon>
                Confirmar Exclusão
            </v-card-title>
            <v-card-text class="text-body-1 py-4">
                Você deseja remover o acesso de <strong class="text-grey-darken-3">{{ funcionarioToDelete?.nomeUsuario }}</strong>? 
                Esta ação desativará o usuário no sistema.
            </v-card-text>
            <v-card-actions class="pt-4">
                <v-spacer></v-spacer>
                <v-btn variant="text" class="rounded-lg font-weight-bold" @click="showDeleteModal = false">CANCELAR</v-btn>
                <v-btn color="error" variant="elevated" class="rounded-lg font-weight-bold px-6" @click="deleteFuncionario" :loading="isDeleting">
                    CONFIRMAR
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<style scoped>
/* CORES CONEXUS #fb910a */
.hero-conexus {
    background: linear-gradient(135deg, #fb910a 0%, #e67e00 100%) !important;
    box-shadow: 0 12px 35px rgba(251, 145, 10, 0.25) !important;
}

.text-brand { color: #fb910a !important; }
.border-l-brand { border-left: 4px solid #fb910a !important; }

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
    transition: background-color 0.2s ease;
}
</style>