<script setup>
import { ref, watch, toRaw, computed } from 'vue';
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores';

const props = defineProps({
    modelValue: Boolean,
    initialData: Object,
    isEditing: Boolean,
});

const emit = defineEmits(['update:modelValue', 'refresh']);

const store = useCalendarioAulaStore(); 
const formRef = ref(null);
const loading = ref(false);

// O formData inicia vazio e é preenchido pelo watch
const formData = ref({});

const rules = { required: v => !!v || 'Campo obrigatório' };

// Estas opções podem vir da store no futuro se o backend fornecer, 
// mas mantemos as cores e ícones para a UI
const statusAulaOptions = [
    { title: 'Agendada', value: 'agendada', color: '#1E88E5', icon: 'mdi-calendar-clock' }, 
    { title: 'Realizada', value: 'realizada', color: '#43A047', icon: 'mdi-check-circle' }, 
    { title: 'Reagendada', value: 'reagendada', color: '#FB8C00', icon: 'mdi-calendar-sync' },
    { title: 'Cancelada', value: 'cancelada', color: '#E53935', icon: 'mdi-close-circle' }
];

// Dados dinâmicos vindos da Store
const turmasOptions = computed(() => store.turmas || []);
const salasOptions = computed(() => store.salas || []);

// Observa mudanças nos dados iniciais (quando abre para editar ou novo)
watch(() => props.initialData, (newVal) => {
    if (!newVal || Object.keys(newVal).length === 0) {
        formData.value = {
            idaula: 0,
            observacoes: '',
            idturma: null,
            sala: '',
            dataAula: new Date().toISOString().substring(0, 10),
            horaInicio: '09:00',
            horaFim: '10:00',
            status: 'agendada',
            linkReuniao: '',
            aulaExtra: false,
            idfuncionario: store.usuarioLogadoId // Supondo que você tenha isso na store
        };
    } else {
        // Mapeia os dados recebidos para o formato que o formulário usa
        formData.value = { ...newVal };
    }
}, { immediate: true });

async function handleSubmit() {
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    loading.value = true;
    try {
        // Envia o objeto bruto para a store
        const payload = toRaw(formData.value);
        
        // CORREÇÃO: Usando 'adicionar' que é o nome na sua store
        const sucesso = await store.adicionar(payload); 
        
        if (sucesso) {
            emit('refresh');
            closeDialog();
        }
    } catch (error) {
        console.error("Erro ao processar formulário:", error);
    } finally {
        loading.value = false;
    }
}

async function handleDelete() {
    if (confirm('Deseja realmente excluir esta aula?')) {
        loading.value = true;
        try {
            const sucesso = await store.deleteAula(formData.value.idaula); 
            if (sucesso) {
                emit('refresh');
                closeDialog();
            }
        } finally {
            loading.value = false;
        }
    }
}

function closeDialog() {
    emit('update:modelValue', false);
}
</script>

<template>
    <v-dialog :model-value="modelValue" @update:model-value="closeDialog" max-width="650" persistent>
        <v-card rounded="xl" class="pa-2">
            <v-card-title class="d-flex align-center pa-4">
                <v-avatar color="#fff9eb" size="48" class="mr-3">
                    <v-icon color="#ffb300">{{ isEditing ? 'mdi-pencil' : 'mdi-calendar-plus' }}</v-icon>
                </v-avatar>
                <div>
                    <div class="text-h6 font-weight-bold">{{ isEditing ? 'Editar Aula' : 'Nova Aula' }}</div>
                    <div class="text-caption text-grey">Preencha os detalhes da atividade</div>
                </div>
                <v-spacer></v-spacer>
                <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog"></v-btn>
            </v-card-title>

            <v-divider class="mx-4"></v-divider>

            <v-card-text class="pa-4">
                <v-form ref="formRef" @submit.prevent="handleSubmit">
                    <v-row dense>
                        <v-col cols="12">
                            <v-text-field
                                v-model="formData.observacoes"
                                label="Título ou Observação da Aula *"
                                prepend-inner-icon="mdi-text-short"
                                :rules="[rules.required]"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <v-select
                                v-model="formData.idturma"
                                :items="turmasOptions"
                                item-title="nome" 
                                item-value="id"
                                label="Turma *"
                                prepend-inner-icon="mdi-school-outline"
                                :rules="[rules.required]"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select
                                v-model="formData.sala"
                                :items="salasOptions"
                                item-title="nome" 
                                item-value="id"
                                label="Sala/Local *"
                                prepend-inner-icon="mdi-map-marker-outline"
                                :rules="[rules.required]"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-select>
                        </v-col>

                        <v-col cols="12" sm="4">
                            <v-text-field
                                v-model="formData.dataAula"
                                label="Data *"
                                type="date"
                                :rules="[rules.required]"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="4">
                            <v-text-field
                                v-model="formData.horaInicio"
                                label="Início *"
                                type="time"
                                prepend-inner-icon="mdi-clock-start"
                                :rules="[rules.required]"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="4">
                            <v-text-field
                                v-model="formData.horaFim"
                                label="Fim *"
                                type="time"
                                prepend-inner-icon="mdi-clock-end"
                                :rules="[rules.required]"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="7">
                            <v-text-field 
                                v-model="formData.linkReuniao" 
                                label="Link da Reunião" 
                                placeholder="https://meet.google.com/..."
                                prepend-inner-icon="mdi-link-variant"
                                variant="outlined" color="#ffb300" rounded="lg"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="5">
                            <v-select
                                v-model="formData.status"
                                :items="statusAulaOptions"
                                label="Status *"
                                variant="outlined" color="#ffb300" rounded="lg"
                            >
                                <template v-slot:selection="{ item }">
                                    <v-chip :color="item.raw.color" size="small" label font-weight-bold>
                                        <v-icon start size="14">{{ item.raw.icon }}</v-icon>
                                        {{ item.title }}
                                    </v-chip>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>

                    <v-checkbox
                        v-model="formData.aulaExtra"
                        label="Esta é uma aula extra?"
                        color="#ffb300"
                        hide-details
                        density="compact"
                    ></v-checkbox>
                </v-form>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>

            <v-card-actions class="pa-4">
                <v-btn 
                    v-if="isEditing" 
                    color="red-darken-1" 
                    variant="text" 
                    class="font-weight-bold" 
                    @click="handleDelete"
                    :loading="loading"
                >
                    EXCLUIR
                </v-btn>
                
                <v-spacer></v-spacer>
                
                <v-btn variant="text" color="grey-darken-1" @click="closeDialog" class="px-6 font-weight-bold">
                    CANCELAR
                </v-btn>

                <v-btn 
                    color="#ffb300" 
                    variant="flat" 
                    class="px-8 font-weight-bold text-white" 
                    rounded="lg"
                    @click="handleSubmit"
                    :loading="loading"
                >
                    {{ isEditing ? 'ATUALIZAR' : 'SALVAR' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>