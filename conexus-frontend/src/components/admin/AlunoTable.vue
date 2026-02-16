<!-- <!-- <script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAlunoStore } from '@/stores/alunoStore'; 
import { useTurmaStore } from '@/stores/turmaStore'; 
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore'; 

const router = useRouter();
const alunoStore = useAlunoStore();
// Assumindo que você tem uma turmaStore para buscar nomes de turmas
const turmaStore = useTurmaStore();
const alunoTurmaStore = useAlunoTurmaStore();

const estaCarregando = ref(true);

const mostrarModalExclusao = ref(false);
const alunoParaExcluir = ref(null);
const estaExcluindo = ref(false);

const alunosFormatados = computed(() => {
    // Retorna vazio se os dados ainda não foram carregados ou se estão vazios
    if (!alunoStore.alunos || !alunoStore.alunos.length) {
        return [];
    }

    return alunoStore.alunos.map(aluno => {
        // Encontra a turma. Você precisará garantir que turmaStore.turmas foi carregada.
        // A lógica de associação de turma deve ser feita com base na estrutura de dados real (ex: aluno.idturma)
        const turma = turmaStore.turmas.find(t => t.idturma === aluno.idturma); 

        // Adiciona um fallback para o nome da turma
        const descricaoTurma = aluno.turmaNome || turma?.descricao || 'Sem Turma Ativa';
            
        return {
            id: aluno.idaluno,
            nome: aluno.nome,
            cpf: aluno.cpf, 
            turma: descricaoTurma, 
            situacao: aluno.situacao || 'N/A', 
        };
    });
});

/*
<template v-slot:["iem.idiomadescricao"]='{item}'>
    <v-chip size='x-mall' variant='outled' color='orange=darken-1'>
        {{item.idiomadescricao || 'N/A'}}</v-chip></template>
*/


// Headers (Cabeçalhos) no formato padrão do v-data-table
const cabecalhos = ref([
    { title: 'Nome', align: 'start', key: 'nome' },
    { title: 'CPF', align: 'start', key: 'cpf' },
    { title: 'Turma', align: 'start', key: 'descricaoTurma' },
    { title: 'Situação', align: 'start', key: 'situacao' },
    { title: 'Ações', align: 'center', key: 'actions', sortable: false }, 
]);

// Funções de Ação
function editarAluno(item) {
    router.push(`/admin/alunos/cadastro/${item.id}`);
}

function confirmarExclusao(item) {
    alunoParaExcluir.value = item;
    mostrarModalExclusao.value = true;
}

async function excluirAluno() {
    if (alunoParaExcluir.value && alunoParaExcluir.value.id) {
        estaExcluindo.value = true;
        
        // Chamada correta para a action 'apagar'
        const sucesso = await alunoStore.apagar(alunoParaExcluir.value.id); 

        if (sucesso) {
            // Recarrega a lista de alunos
            await alunoStore.exibir(); 
            // Opcional: mostrar um snackbar de sucesso
        } else {
            // Opcional: mostrar um snackbar de erro
        }

        estaExcluindo.value = false;
        mostrarModalExclusao.value = false;
        alunoParaExcluir.value = null;
    }
}

function verContrato(item) {
    // Implementar a lógica de visualização/download de contrato
    console.log(`Visualizando contrato do aluno: ${item.nome}`);
}

function adicionarNovoAluno() {
    router.push('/admin/alunos/cadastro');
}

// Carrega dados no montagem do componente
onMounted(async () => {
    estaCarregando.value = true;
    try {
        // Carrega alunos e turmas em paralelo
        await Promise.all([
            alunoStore.exibir(),
            alunoTurmaStore.exibir(),
        ]);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    } finally {
        estaCarregando.value = false;
    }
});
</script>

<template>
    <v-card class="aluno-container" max-width="1500" elevation="2"> 

        <v-toolbar color="orange-darken-1" density="compact" flat>
            <v-toolbar-title class="text-white font-weight-bold ml-2">Estudantes</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="white" prepend-icon="mdi-plus" class="text-none font-weight-bold" @click="adicionarNovoAluno">
                Novo Estudante
            </v-btn>
        </v-toolbar>

        <v-data-table
            :headers="cabecalhos"
            :items="alunosFormatados" 
            class="elevation-0" 
            item-key="id"
            :loading="estaCarregando"
            loading-text="Carregando dados, por favor aguarde..."
        >
            
            <template v-slot:item.actions="{ item }">
                <v-btn 
                    color="warning" 
                    variant="flat" 
                    size="small"
                    class="mr-2 text-none font-weight-bold" 
                    @click="editarAluno(item)"
                >
                    Editar
                </v-btn>

                <v-btn 
                    color="error" 
                    variant="flat" 
                    size="small"
                    class="mr-2 text-none font-weight-bold" 
                    @click="confirmarExclusao(item)"
                >
                    Excluir
                </v-btn>
                
                <v-btn 
                    color="orange" 
                    variant="flat" 
                    size="small"
                    class="text-none font-weight-bold" 
                    @click="verContrato(item)"
                >
                    Contrato
                </v-btn>
            </template>
            
            <template v-slot:no-data>
                <div class="pa-4 text-center" v-if="!estaCarregando">
                    <v-icon size="40" color="grey-lighten-1">mdi-account-school-outline</v-icon>
                    <p class="text-subtitle-1 text-grey-darken-1 mt-2">Nenhum estudante encontrado. Cadastre o primeiro!</p>
                </div>
            </template>

        </v-data-table>

        <v-dialog v-model="mostrarModalExclusao" max-width="400">
            <v-card>
                <v-card-title class="headline text-error">Confirmar Exclusão</v-card-title>
                <v-card-text>
                    Tem certeza de que deseja excluir o estudante 
                    <span class="font-weight-bold">{{ alunoParaExcluir?.nome }}</span>?
                    Esta ação é irreversível.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" variant="text" @click="mostrarModalExclusao = false" :disabled="estaExcluindo">
                        Cancelar
                    </v-btn>
                    <v-btn color="error" variant="flat" @click="excluirAluno" :loading="estaExcluindo">
                        Excluir
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-card>
</template>

<style scoped>
/* Estilos para o Card Principal e Cabeçalho */
.aluno-container {
    border-radius: 8px;
    max-width: 1200px; 
    margin: 0 auto; 
}

/* Garante que o toolbar tenha bordas arredondadas no topo */
.v-toolbar {
    border-radius: 8px 8px 0 0 !important; 
}

/* Estilos de célula e linha */
.v-data-table :deep(td) {
    padding: 12px 16px !important; 
    font-size: 0.875rem; 
    vertical-align: middle;
}
</style> -->


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAlunoTurmaStore } from '@/stores/alunoTurmaStore';

const router = useRouter();
const alunoTurmaStore = useAlunoTurmaStore();

const busca = ref('');
const estaCarregando = ref(true);
const mostrarModalExclusao = ref(false);
const alunoParaExcluir = ref(null);
const estaExcluindo = ref(false);

// Cabeçalhos da tabela
const cabecalhos = [
  { title: 'ESTUDANTE', align: 'start', key: 'nome' },
  { title: 'CPF', align: 'start', key: 'cpf' },
  { title: 'TURMA ATUAL', align: 'start', key: 'turma' },
  { title: 'SITUAÇÃO', align: 'center', key: 'situacao' },
  { title: 'AÇÕES', align: 'center', key: 'actions', sortable: false },
];

// Computed otimizado: consome diretamente do alunoTurmaStore
const alunosFormatados = computed(() => {
  if (!alunoTurmaStore.alunoTurmas) return [];
  
  return alunoTurmaStore.alunoTurmas.map(registro => ({
    id: registro.idaluno,
    idRelacao: registro.idalunoturma, // ID da relação para exclusão se necessário
    nome: registro.aluno?.nome || 'N/A',
    cpf: registro.aluno?.cpf || 'N/A',
    turma: registro.turma?.descricao || 'Sem Turma Ativa',
    situacao: registro.situacao || 'Ativo',
  }));
});

// Indicadores para os cards
const totalMatriculados = computed(() => alunosFormatados.value.length);
const totalAtivos = computed(() => alunosFormatados.value.filter(a => a.situacao === 'Ativo').length);

// Funções de ação
function editarAluno(item) {
  router.push(`/admin/alunos/cadastro/${item.id}`);
}

function confirmarExclusao(item) {
  alunoParaExcluir.value = item;
  mostrarModalExclusao.value = true;
}

async function excluirAluno() {
  if (!alunoParaExcluir.value?.id) return;

  estaExcluindo.value = true;
  // Nota: Verifique se no seu store o método apagar espera o ID do aluno ou da relação aluno_turma
  const sucesso = await alunoTurmaStore.apagar(alunoParaExcluir.value.id);

  if (sucesso) await alunoTurmaStore.exibir();

  estaExcluindo.value = false;
  mostrarModalExclusao.value = false;
  alunoParaExcluir.value = null;
}

function verContrato(item) {
  console.log(`Gerando contrato para: ${item.nome}`);
}

function adicionarNovoAluno() {
  router.push('/admin/alunos/cadastro');
}

onMounted(async () => {
  estaCarregando.value = true;
  try {
    await alunoTurmaStore.exibir();
  } finally {
    estaCarregando.value = false;
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
                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                  <v-icon size="32">mdi-account-school</v-icon>
                </v-avatar>
                <div>
                  <h1 class="text-h4 font-weight-black mb-1">Corpo Discente</h1>
                  <p class="text-subtitle-1 opacity-80 font-weight-light">Gestão de matrículas, turmas e situações acadêmicas</p>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="5" class="text-md-right">
              <v-btn 
                color="white" 
                prepend-icon="mdi-plus" 
                size="large" 
                class="rounded-lg font-weight-bold text-orange-darken-4 shadow-soft" 
                @click="adicionarNovoAluno"
              >
                NOVO ESTUDANTE
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-4" v-if="!estaCarregando">
      <v-col cols="12" sm="4" md="3">
        <v-card flat border class="rounded-xl pa-4 bg-surface border-l-brand">
          <div class="text-caption font-weight-bold opacity-60 text-uppercase">Total de Matrículas</div>
          <div class="text-h5 font-weight-black text-brand">{{ totalMatriculados }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" md="3">
        <v-card flat border class="rounded-xl pa-4 bg-surface border-l-success">
          <div class="text-caption font-weight-bold opacity-60 text-uppercase">Alunos Ativos</div>
          <div class="text-h5 font-weight-black text-success">{{ totalAtivos }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card flat border class="rounded-xl overflow-hidden bg-surface shadow-main">
      <v-toolbar flat class="bg-surface px-4 border-b">
        <v-text-field
          v-model="busca"
          prepend-inner-icon="mdi-magnify"
          label="Pesquisar por nome, CPF ou turma..."
          variant="solo-filled"
          flat hide-details density="compact"
          class="rounded-lg" style="max-width: 400px;"
        ></v-text-field>
      </v-toolbar>

      <v-data-table
        :headers="cabecalhos"
        :items="alunosFormatados"
        :search="busca"
        :loading="estaCarregando"
        class="custom-table"
        hover
      >
        <template #[`item.nome`]="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar size="32" color="orange-lighten-5" class="mr-3">
              <span class="text-orange-darken-3 font-weight-bold text-caption">{{ item.nome.charAt(0) }}</span>
            </v-avatar>
            <span class="font-weight-bold text-grey-darken-3">{{ item.nome }}</span>
          </div>
        </template>

        <template #[`item.turma`]="{ value }">
          <div class="d-flex align-center">
            <v-icon size="16" color="grey" class="mr-2">mdi-google-classroom</v-icon>
            <span class="text-body-2">{{ value }}</span>
          </div>
        </template>

        <template #[`item.situacao`]="{ value }">
          <v-chip
            :color="value === 'Ativo' ? 'success' : 'warning'"
            size="x-small"
            class="font-weight-black text-uppercase"
            variant="tonal"
          >
            {{ value }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-center">
            <v-tooltip text="Editar">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-pencil-outline" variant="text" size="small" color="blue" @click="editarAluno(item)"></v-btn>
              </template>
            </v-tooltip>
            
            <v-tooltip text="Ver Contrato">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-file-document-outline" variant="text" size="small" color="orange-darken-2" @click="verContrato(item)"></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Excluir">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon="mdi-trash-can-outline" variant="text" size="small" color="error" @click="confirmExclusao(item)"></v-btn>
              </template>
            </v-tooltip>
          </div>
        </template>

        <template v-slot:bottom>
          <v-divider></v-divider>
          <div class="pa-4 bg-card-sub text-center opacity-50 text-caption font-weight-bold">
            SECRETARIA ACADÊMICA • CONEXUS 2025
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="mostrarModalExclusao" max-width="450">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="d-flex align-center text-error font-weight-black">
          <v-icon start color="error">mdi-alert-octagon</v-icon>
          Confirmar Exclusão
        </v-card-title>
        <v-card-text class="py-4">
          Tem certeza que deseja remover o registro do aluno <strong>{{ alunoParaExcluir?.nome }}</strong>?
          Esta ação não poderá ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" class="rounded-lg font-weight-bold" @click="mostrarModalExclusao = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" class="rounded-lg font-weight-bold px-6" @click="excluirAluno" :loading="estaExcluindo">
            Confirmar Exclusão
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<style scoped>
.hero-conexus {
  background: linear-gradient(135deg, #fb910a 0%, #e67e00 100%) !important;
  box-shadow: 0 12px 35px rgba(251, 145, 10, 0.25) !important;
}

.text-brand { color: #fb910a !important; }
.border-l-brand { border-left: 4px solid #fb910a !important; }
.border-l-success { border-left: 4px solid #4CAF50 !important; }

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
}

.shadow-main { box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important; }
.bg-card-sub { background-color: rgba(251, 145, 10, 0.03); }
.z-index-1 { z-index: 1; }
.backdrop-blur { backdrop-filter: blur(8px); }
.shadow-soft { box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important; }
</style>
