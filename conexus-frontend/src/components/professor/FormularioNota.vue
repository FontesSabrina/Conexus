<script setup>
import { ref, watch } from 'vue';
import { useAvaliacaoStore } from '@/stores/avaliacaoStores'; // Conforme estrutura

const props = defineProps({
  aluno: Object,
  modelValue: Boolean
});
const emit = defineEmits(['update:modelValue', 'salvo']);

const avaliacaoStore = useAvaliacaoStore();
const localAluno = ref({ nome: '', nota1: 0, nota2: 0 });
const salvando = ref(false);

watch(() => props.aluno, (newVal) => {
  if (newVal) {
    localAluno.value = { ...newVal };
  }
}, { immediate: true });

async function salvar() {
  salvando.value = true;
  try {
    // Utiliza o store de avaliações para persistir os dados
    await avaliacaoStore.salvarNota(localAluno.value);
    emit('salvo');
    emit('update:modelValue', false);
  } finally {
    salvando.value = false;
  }
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="450">
    <v-card rounded="lg">
      <v-toolbar color="#ffb300" density="comfortable">
        <v-toolbar-title class="text-white font-weight-bold">Lançar Notas</v-toolbar-title>
      </v-toolbar>

      <v-card-text class="pt-6">
        <div class="text-subtitle-1 mb-4">
          <strong>Aluno:</strong> {{ localAluno.nome }}
        </div>
        
        <v-text-field
          v-model.number="localAluno.nota1"
          label="Nota P1"
          type="number"
          variant="outlined"
          color="#ffb300"
        ></v-text-field>

        <v-text-field
          v-model.number="localAluno.nota2"
          label="Nota P2"
          type="number"
          variant="outlined"
          color="#ffb300"
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey-darken-1" @click="emit('update:modelValue', false)">
          CANCELAR
        </v-btn>
        <v-btn 
          color="#4caf50" 
          variant="elevated" 
          class="text-white px-6"
          :loading="salvando" 
          @click="salvar"
        >
          SALVAR
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>