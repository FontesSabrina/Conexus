<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTipoMaterialStore } from '@/stores/tipoMaterialStores'

const props = defineProps({
    turmasDisponiveis: {
        type: Array,
        default: () => []
    }
})

const model = defineModel({
    type: Object,
    required: true
})

const emit = defineEmits(['save', 'close'])

const tipoMaterialStore = useTipoMaterialStore()

const turmasOptions = computed(() => {
    return props.turmasDisponiveis.map(t => ({
        title: `Turma: ${t.sala || t.nome} - ${t.idiomaDescricao || t.idioma}`,
        value: t.idturma
    }))
})

const tiposMaterial = computed(() => {
    return tipoMaterialStore.tiposMaterial.map(t => ({
        title: t.descricao,
        value: t.idtipomaterial
    }))
})

onMounted(() => {
    if (!tipoMaterialStore.tiposMaterial.length) {
        tipoMaterialStore.exibir()
    }
})

const estaEnviando = ref(false)

function submitForm() {
    emit('save', model.value)
}

function closeDialog() {
    emit('close')
}
</script>


<template>
    <v-card class="bg-surface rounded-lg">
        <v-toolbar color="#ffb300" density="compact" flat>
            <v-toolbar-title class="text-white font-weight-bold ml-2">
                {{ model.idmaterial ? 'Editar Material Didático' : 'Novo Material Didático' }}
            </v-toolbar-title>

            <v-spacer />

            <v-btn
                icon="mdi-close"
                variant="text"
                color="white"
                @click="closeDialog"
            />
        </v-toolbar>

        <v-card-text class="pt-6 pb-2">
            <v-container>
                <v-row dense>
                    <v-col cols="12">
                        <v-select
                            v-model="model.idturma"
                            :items="turmasOptions"
                            label="Turma Destino"
                            prepend-inner-icon="mdi-school"
                            variant="outlined"
                            color="#ffb300"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="model.titulo"
                            label="Título do Material"
                            prepend-inner-icon="mdi-format-title"
                            variant="outlined"
                            color="#ffb300"
                        />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-select
                            v-model="model.idtipoMaterial"
                            :items="tiposMaterial"
                            label="Tipo"
                            prepend-inner-icon="mdi-file-document-outline"
                            variant="outlined"
                            color="#ffb300"
                        />
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-select
                            v-model="model.nivel"
                            :items="['Básico', 'Intermediário', 'Avançado']"
                            label="Nível"
                            prepend-inner-icon="mdi-chart-bar"
                            variant="outlined"
                            color="#ffb300"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="model.link"
                            label="Link (URL)"
                            prepend-inner-icon="mdi-link"
                            variant="outlined"
                            color="#ffb300"
                        />
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
            <v-spacer />

            <v-btn
                variant="text"
                color="grey-darken-1"
                class="font-weight-bold text-none"
                @click="closeDialog"
            >
                CANCELAR
            </v-btn>

            <v-btn
                color="#4CAF50"
                variant="elevated"
                size="large"
                class="btn-salvar-fixo text-none px-6"
                :loading="estaEnviando"
                @click="submitForm"
            >
                SALVAR
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.btn-salvar-fixo {
    background-color: #4CAF50 !important;
    color: white !important;
    font-weight: bold !important;
    letter-spacing: 0.5px;
}

:deep(.v-field__prepend-inner .v-icon) {
    color: #000000 !important;
    opacity: 1;
}

.text-none {
    text-transform: none !important;
}
</style>
