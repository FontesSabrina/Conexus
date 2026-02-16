<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore';
import { usePresencaStore } from '@/stores/presencaStores';
import { useTurmaStore } from '@/stores/turmaStore';
import { useAuthStore } from '@/stores/authStore'; 

const route = useRoute();
const router = useRouter();

const alunoTurmaStore = useAlunoTurmaStore();
const presencaStore = usePresencaStore();
const turmaStore = useTurmaStore();
const authStore = useAuthStore();


const turmaId = route.params.turmaId;

const alunos = ref([]);
const turmaInfo = ref(null);
const loading = ref(true);
const saving = ref(false);
const presencaStatus = ref({}); 


const hoje = computed(() => {
    return new Date().toISOString().split('T')[0];
});

async function carregarDados() {
    loading.value = true;
    try {
        if (!turmaId) return; 

        if (turmaStore.turmas.length === 0) {
            await turmaStore.exibir();
        }
        turmaInfo.value = turmaStore.turmas.find(t => t.idturma == turmaId);

        const alunosDaTurma = await alunoTurmaStore.buscarAlunosPorTurma(turmaId);

        if (alunosDaTurma && alunosDaTurma.length > 0) {
            alunos.value = alunosDaTurma;

            alunosDaTurma.forEach(item => {
                presencaStatus.value[item.idalunoTurma] = true; 
            });
        }
        
    } catch (error) {
        console.error("Erro ao carregar dados da presença:", error);
    } finally {
        loading.value = false;
    }
}

async function salvar() {
    saving.value = true;
    

    const idfuncionario = authStore.user?.idfuncionario || 1; 

    const registrosParaSalvar = Object.keys(presencaStatus.value).map(idalunoturma => {
        return {
            idalunoturma: parseInt(idalunoturma),
            idfuncionario: idfuncionario,
            presente: presencaStatus.value[idalunoturma],
            data: hoje.value 
        };
    });

    try {
        if (registrosParaSalvar.length === 0) {
            alert('Não há alunos para registrar presença.');
            return;
        }

        const sucesso = await presencaStore.registrarPresencas(registrosParaSalvar); 

        if (sucesso) {
            alert('Registro de presença salvo com sucesso!');
            router.push({ name: 'ProfessorTurmas' }); 
        } else {
            alert('Falha ao salvar o registro de presença.');
        }

    } catch (error) {
        console.error("Erro ao salvar presenças:", error);
    } finally {
        saving.value = false;
    }
}

function voltar() {
    router.push({ name: 'ProfessorTurmas' });
}

onMounted(() => {
    if (!turmaId) {
        router.push({ name: 'ProfessorTurmas' });
        return;
    }
    carregarDados();
});
</script>

<template>
    <v-card elevation="2" class="ma-4">
        <v-card-title class="text-h5 font-weight-bold bg-orange-darken-1 text-white pa-4">
            <v-icon start>mdi-list-status</v-icon>
            Registro de Presença
            <span v-if="turmaInfo" class="ml-2">
                - {{ turmaInfo.descricao || turmaInfo.sala }}
            </span>
        </v-card-title>
        
        <v-card-text class="pa-4">
            <div v-if="loading" class="text-center pa-10">
                <v-progress-circular indeterminate color="orange"></v-progress-circular>
                <div class="mt-2">Buscando alunos da turma...</div>
            </div>
            
            <v-alert v-else-if="alunos.length === 0" type="warning" variant="tonal" class="mb-4">
                Nenhum aluno matriculado nesta turma.
            </v-alert>

            <v-form v-else @submit.prevent="salvar">
                <v-alert type="info" variant="tonal" class="mb-4">
                    Marque os alunos que estão <strong>Presentes</strong> na aula de hoje ({{ hoje }}).
                </v-alert>
                
                <v-table class="mb-6 elevation-1">
                    <thead>
                        <tr>
                            <th class="text-left">Aluno</th>
                            <th class="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in alunos" :key="item.idalunoTurma">
                            <td>{{ item.aluno?.nomealuno || 'Aluno não identificado' }}</td> 
                            <td class="text-center">
                                <v-checkbox
                                    v-model="presencaStatus[item.idalunoTurma]"
                                    :label="presencaStatus[item.idalunoTurma] ? 'Presente' : 'Faltou'"
                                    :color="presencaStatus[item.idalunoTurma] ? 'success' : 'error'"
                                    density="compact"
                                    hide-details
                                ></v-checkbox>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <v-divider class="my-4"></v-divider>

                <div class="d-flex">
                    <v-btn
                        type="submit"
                        color="success"
                        :loading="saving"
                        :disabled="alunos.length === 0 || saving"
                        size="large"
                        class="px-8"
                    >
                        <v-icon start icon="mdi-content-save"></v-icon>
                        Salvar Chamada
                    </v-btn>
                    
                    <v-btn
                        color="grey-darken-1"
                        variant="tonal"
                        @click="voltar"
                        class="ml-3"
                        :disabled="saving"
                    >
                        Cancelar
                    </v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>