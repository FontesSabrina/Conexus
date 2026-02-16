<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore';
import { useTurmaStore } from '@/stores/turmaStore';
// Descomente quando o store de avaliação estiver pronto
// import { useAvaliacaoStore } from '@/stores/avaliacaoStores'; 

const alunoTurmaStore = useAlunoTurmaStore();
const turmaStore = useTurmaStore(); 

const NOTA_MINIMA_APROVACAO = 7.0;
const NOTA_MINIMA_RECUPERACAO = 5.0; 

const turmaSelecionada = ref(null);
const listaAlunosComNotas = ref([]); 
const estaCarregando = ref(false);
const estaSalvando = ref(false);

const headers = [
    { title: 'Nome do Aluno', key: 'nome', sortable: false },
    { title: 'Matrícula', key: 'idaluno', sortable: false },
    { title: 'Nota P1', key: 'nota1', align: 'center', sortable: false },
    { title: 'Nota P2', key: 'nota2', align: 'center', sortable: false },
    { title: 'Média Final', key: 'notaFinal', align: 'center', sortable: false },
    { title: 'Status', key: 'status', align: 'center', sortable: false },
];

// Conecta diretamente com as turmas carregadas no Store
const turmasOptions = computed(() => {
    return (turmaStore.turmas || []).map(t => ({
        title: `${t.sala} - ${t.idioma?.nome || 'Idioma'}`, 
        value: t.idturma
    }));
});

function calcularMediaEStatus(aluno) {
    const p1 = parseFloat(aluno.nota1) || 0;
    const p2 = parseFloat(aluno.nota2) || 0;
    const media = (p1 + p2) / 2;
    const mediaArredondada = parseFloat(media.toFixed(1));

    let status = 'Pendente';
    let color = 'text-grey-darken-1';

    if (p1 > 0 || p2 > 0) { 
        if (media >= NOTA_MINIMA_APROVACAO) {
            status = 'Aprovado';
            color = 'text-success';
        } else if (media >= NOTA_MINIMA_RECUPERACAO) {
            status = 'Recuperação';
            color = 'text-warning'; 
        } else {
            status = 'Reprovado';
            color = 'text-error'; 
        }
    }
    return { media: mediaArredondada, status, color };
}

const alunosComStatus = computed(() => {
    return listaAlunosComNotas.value.map(aluno => {
        const { media, status, color } = calcularMediaEStatus(aluno);
        return {
            ...aluno,
            notaFinal: media, 
            status: status,
            statusColor: color,
        };
    });
});

// BUSCA REAL: Usa o alunoTurmaStore para pegar os alunos da turma selecionada
async function buscarAlunosENotas() {
    if (!turmaSelecionada.value) {
        listaAlunosComNotas.value = [];
        return;
    }
    
    estaCarregando.value = true;
    try {
        const alunosDaTurma = await alunoTurmaStore.buscarAlunosPorTurma(turmaSelecionada.value);
        
        // Mapeia os dados do banco para o formato da tabela
        listaAlunosComNotas.value = alunosDaTurma.map(aluno => ({
            idaluno: aluno.idaluno,
            nome: aluno.nomealuno || aluno.usuario?.nome, // Ajuste conforme o retorno da sua API
            nota1: 0, // Inicia zerado para preenchimento
            nota2: 0,
            idTurma: turmaSelecionada.value
        }));
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    } finally {
        estaCarregando.value = false;
    }
}

async function salvarNotas() {
    if (!turmaSelecionada.value || alunosComStatus.value.length === 0) return;
    
    estaSalvando.value = true;
    try {
        // Aqui você enviaria para o seu banco através do Store de Avaliação
        console.log("Enviando dados reais:", alunosComStatus.value);
        alert("Notas enviadas com sucesso!");
    } catch (error) {
        alert("Erro ao salvar.");
    } finally {
        estaSalvando.value = false;
    }
}

watch(turmaSelecionada, buscarAlunosENotas);

// CARGA INICIAL: Busca todas as turmas do professor ao montar a tela
onMounted(async () => {
    estaCarregando.value = true;
    await turmaStore.exibir();
    estaCarregando.value = false;
});
</script>

<template>
    <v-card class="mx-auto mt-5" max-width="1100" elevation="3">
        <v-toolbar color="#ffb300" density="compact">
            <v-toolbar-title class="text-white font-weight-bold ml-2">
                <v-icon start icon="mdi-chart-line" class="mr-2"></v-icon>
                Lançamento de Notas
            </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <v-row class="mt-2 mb-4">
                <v-col cols="12">
                    <v-select
                        v-model="turmaSelecionada"
                        :items="turmasOptions"
                        label="Selecione a Turma"
                        prepend-inner-icon="mdi-school"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                    ></v-select>
                </v-col>
            </v-row>
            
            <v-divider></v-divider>
            
            <v-data-table
                :headers="headers"
                :items="alunosComStatus"
                :loading="estaCarregando"
                hide-default-footer
                class="elevation-0 mt-4 border"
                :items-per-page="-1"
            >
                <template v-slot:item.nota1="{ item }">
                    <v-text-field
                        v-model="item.nota1"
                        type="number"
                        density="compact"
                        hide-details
                        variant="outlined"
                        class="mx-auto"
                        style="max-width: 80px;"
                    ></v-text-field>
                </template>

                <template v-slot:item.nota2="{ item }">
                    <v-text-field
                        v-model="item.nota2"
                        type="number"
                        density="compact"
                        hide-details
                        variant="outlined"
                        class="mx-auto"
                        style="max-width: 80px;"
                    ></v-text-field>
                </template>

                <template v-slot:item.notaFinal="{ item }">
                    <span :class="['font-weight-black text-h6', item.statusColor]">
                        {{ item.notaFinal }}
                    </span>
                </template>

                <template v-slot:item.status="{ item }">
                    <v-chip size="small" label :color="item.status === 'Aprovado' ? 'success' : item.status === 'Recuperação' ? 'warning' : item.status === 'Reprovado' ? 'error' : 'grey'">
                        {{ item.status }}
                    </v-chip>
                </template>
            </v-data-table>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 justify-end">
            <v-btn
                color="success"
                variant="elevated"
                size="large"
                :loading="estaSalvando"
                :disabled="!turmaSelecionada || alunosComStatus.length === 0"
                @click="salvarNotas"
                class="px-8 font-weight-bold"
            >
                Salvar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.text-success { color: #4CAF50 !important; }
.text-warning { color: #FFC107 !important; }
.text-error { color: #F44336 !important; }

/* Remove setas do input number */
:deep(input::-webkit-outer-spin-button),
:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>