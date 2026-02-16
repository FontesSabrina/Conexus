<script setup>
import { ref, computed, watch } from 'vue';
import FormularioNota from './FormularioNota.vue';

const emit = defineEmits(['editar-aluno']);

// --- DADOS ESTÁTICOS PARA TESTE ---
const MOCK_TURMAS = [
  { idturma: 1, sala: 'Sala 101 - Inglês' },
  { idturma: 2, sala: 'Sala 202 - Espanhol' }
];

const MOCK_ALUNOS = {
  1: [
    { idaluno: 1, nome: 'Ana Paula Santos', nota1: 8.5, nota2: 7.0 },
    { idaluno: 2, nome: 'Bruno Oliveira', nota1: 6.0, nota2: 5.5 }
  ],
  2: [
    { idaluno: 3, nome: 'Carla Mendes', nota1: 9.0, nota2: 10.0 }
  ]
};

const turmaSelecionada = ref(null);
const busca = ref('');
const carregando = ref(false);
const alunosDaTurma = ref([]);

const modalAberto = ref(false);
const alunoSelecionado = ref(null);

const headers = [
  { title: 'ALUNO', key: 'nome', align: 'start' },
  { title: 'P1', key: 'nota1', align: 'center' },
  { title: 'P2', key: 'nota2', align: 'center' },
  { title: 'MÉDIA', key: 'media', align: 'center' },
  { title: 'AÇÕES', key: 'actions', align: 'center', sortable: false },
];

const turmasOptions = computed(() => 
  MOCK_TURMAS.map(t => ({ title: t.sala, value: t.idturma }))
);

// Estatísticas da Turma
const estatisticas = computed(() => {
  if (alunosDaTurma.value.length === 0) return { media: 0, aprovados: 0 };
  const medias = alunosDaTurma.value.map(a => (a.nota1 + a.nota2) / 2);
  const soma = medias.reduce((a, b) => a + b, 0);
  return {
    mediaGeral: (soma / medias.length).toFixed(1),
    totalAlunos: alunosDaTurma.value.length,
    aprovados: medias.filter(m => m >= 7).length
  };
});

async function carregarAlunos() {
  if (!turmaSelecionada.value) {
    alunosDaTurma.value = [];
    return;
  }
  carregando.value = true;
  setTimeout(() => {
    alunosDaTurma.value = MOCK_ALUNOS[turmaSelecionada.value] || [];
    carregando.value = false;
  }, 500);
}

function abrirFormulario(aluno) {
  alunoSelecionado.value = aluno;
  modalAberto.value = true;
}

watch(turmaSelecionada, carregarAlunos);
</script>

<template>
  <v-container fluid class="pa-6 bg-background min-h-screen">
    
    <v-row>
      <v-col cols="12">
        <v-card flat class="hero-conexus rounded-xl pa-8 mb-6 position-relative overflow-hidden">
          <div class="deco-circle"></div>
          
          <v-row align="center" class="position-relative z-index-1">
            <v-col cols="12" md="6">
              <div class="d-flex align-center">
                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                  <v-icon color="white" size="32">mdi-chart-areaspline</v-icon>
                </v-avatar>
                <div>
                  <h1 class="text-h4 font-weight-black text-white mb-1 text-uppercase">Gestão de Notas</h1>
                  <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                    Lançamento de avaliações e controle de desempenho
                  </p>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="turmaSelecionada"
                :items="turmasOptions"
                label="Selecione a Turma"
                variant="solo"
                flat
                hide-details
                bg-color="rgba(255,255,255,0.2)"
                theme="dark"
                class="rounded-lg custom-filter"
                prepend-inner-icon="mdi-google-classroom"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-4" v-if="turmaSelecionada && !carregando">
      <v-col cols="12" sm="4">
        <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main border-l-primary">
          <div class="text-caption font-weight-bold opacity-60 text-uppercase">Média Geral da Turma</div>
          <div class="text-h5 font-weight-black text-brand">{{ estatisticas.mediaGeral }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
          <div class="text-caption font-weight-bold text-grey text-uppercase">Total de Alunos</div>
          <div class="text-h5 font-weight-black">{{ estatisticas.totalAlunos }}</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card flat border class="rounded-xl pa-4 bg-surface shadow-main">
          <div class="text-caption font-weight-bold text-success text-uppercase">Aprovados (Média ≥ 7)</div>
          <div class="text-h5 font-weight-black text-success">{{ estatisticas.aprovados }}</div>
        </v-card>
      </v-col>
    </v-row>

    <v-card flat border class="rounded-xl overflow-hidden shadow-main bg-surface">
      <v-toolbar flat class="bg-surface px-4">
        <v-text-field
          v-model="busca"
          prepend-inner-icon="mdi-magnify"
          label="Buscar aluno na turma..."
          variant="solo-filled"
          flat
          hide-details
          density="compact"
          class="rounded-lg"
          style="max-width: 400px;"
        ></v-text-field>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="alunosDaTurma"
        :search="busca"
        :loading="carregando"
        class="custom-table"
        hover
      >
        <template #[`item.nome`]="{ item }">
          <div class="d-flex align-center py-3">
            <v-avatar size="32" color="rgba(255, 179, 0, 0.1)" class="mr-3">
              <v-icon color="#ffb300" size="18">mdi-account-outline</v-icon>
            </v-avatar>
            <span class="font-weight-black text-grey-darken-3">{{ item.nome }}</span>
          </div>
        </template>

        <template #[`item.nota1`]="{ value }">
          <span class="font-weight-bold">{{ value.toFixed(1) }}</span>
        </template>
        
        <template #[`item.nota2`]="{ value }">
          <span class="font-weight-bold">{{ value.toFixed(1) }}</span>
        </template>

        <template #[`item.media`]="{ item }">
          <v-chip
            :color="((item.nota1 + item.nota2) / 2) >= 7 ? 'success' : 'error'"
            size="small"
            class="font-weight-black"
            variant="tonal"
          >
            {{ ((item.nota1 + item.nota2) / 2).toFixed(1) }}
          </v-chip>
        </template>
        
        <template #[`item.actions`]="{ item }">
          <v-btn 
            icon="mdi-pencil-box-outline" 
            variant="text"
            color="#ffb300" 
            size="small" 
            @click="abrirFormulario(item)"
          ></v-btn>
        </template>

        <template v-slot:bottom>
          <v-divider></v-divider>
          <div class="pa-4 bg-card-sub text-center opacity-50 text-caption">
            Sistema de Lançamento de Notas • Conexus 2025
          </div>
        </template>

        <template v-slot:loading>
          <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
        </template>
      </v-data-table>
    </v-card>

    <FormularioNota 
      v-model="modalAberto" 
      :aluno="alunoSelecionado" 
      @salvo="carregarAlunos"
    />
  </v-container>
</template>

<style scoped>
/* TEMA DE CORES #ffb300 */
.hero-conexus {
  background: linear-gradient(135deg, #ffb300 0%, #fb910a 100%) !important;
  box-shadow: 0 12px 35px rgba(251, 145, 10, 0.2) !important;
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

/* CUSTOMIZAÇÃO DA TABELA */
.custom-table :deep(thead th) {
  font-weight: 800 !important;
  text-transform: uppercase !important;
  font-size: 0.7rem !important;
  letter-spacing: 0.5px;
  color: #455a64 !important;
  background-color: #fcfcfc !important;
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

.custom-filter :deep(.v-field__input) {
    color: white !important;
}
</style>