<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores';
import AulasForm from './AulasFrom.vue'; 

const store = useCalendarioAulaStore();
const currentDate = ref(new Date()); 
const showForm = ref(false);
const selectedAula = ref({});
const isEditing = ref(false);
const loading = ref(false);

const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Cor temática oficial do Professor/Admin vista nas imagens
const THEME_COLOR = '#ffb300'; 

const statusAulaOptions = [
    { title: 'Agendada', value: 'agendada', color: '#1E88E5' }, 
    { title: 'Realizada', value: 'realizada', color: '#43A047' }, 
    { title: 'Reagendada', value: 'reagendada', color: '#fb910a' },
    { title: 'Cancelada', value: 'cancelada', color: '#E53935' }
];

const getStatusColor = (status) => {
    const option = statusAulaOptions.find(opt => opt.value === status);
    return option ? option.color : THEME_COLOR;
};

const todasAsAulas = computed(() => store.aulas || []);

const daysInMonth = computed(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push({ day: null });
    }
    
    for (let i = 1; i <= lastDateOfMonth; i++) {
        const dataFormatada = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const aulasDoDia = todasAsAulas.value.filter(aula => aula.dataAula === dataFormatada);
        
        days.push({
            day: i,
            dateStr: dataFormatada,
            events: aulasDoDia
        });
    }
    return days;
});

const currentMonthName = computed(() => {
    return currentDate.value.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
});

function prevMonth() { currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1)); }
function nextMonth() { currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1)); }

function abrirInclusao() {
    isEditing.value = false;
    selectedAula.value = {};
    showForm.value = true;
}

function abrirEdicaoParaForm(aula) {
    selectedAula.value = { ...aula };
    isEditing.value = true;
    showForm.value = true;
}

const formatarData = (dataStr) => {
    if (!dataStr) return "";
    const partes = dataStr.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

onMounted(async () => {
    loading.value = true;
    try { await store.exibir(); } 
    catch (e) { console.error("Erro ao carregar aulas:", e); } 
    finally { loading.value = false; }
});
</script>

<template>
    <v-container fluid class="pa-6 bg-background">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-banner rounded-xl pa-6 mb-6 d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-avatar color="rgba(255,255,255,0.2)" class="mr-4 shadow-sm">
                            <v-icon color="white">mdi-calendar-multiselect</v-icon>
                        </v-avatar>
                        <div>
                            <h2 class="text-h5 font-weight-black text-white text-uppercase">
                                {{ currentMonthName }}
                            </h2>
                            <p class="text-caption text-white opacity-80 mb-0">Gestão acadêmica e cronograma de aulas</p>
                        </div>
                    </div>
                    
                    <div class="d-flex align-center">
                        <v-btn icon size="small" flat color="rgba(255,255,255,0.2)" class="text-white mr-2" @click="prevMonth">
                            <v-icon size="small">mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn icon size="small" flat color="rgba(255,255,255,0.2)" class="text-white mr-6" @click="nextMonth">
                            <v-icon size="small">mdi-chevron-right</v-icon>
                        </v-btn>

                        <v-btn color="white" class="text-amber-darken-4 font-weight-black rounded-lg" prepend-icon="mdi-plus" elevation="2" @click="abrirInclusao">
                            CADASTRAR AULA
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row no-gutters>
            <v-col cols="12" md="8" class="pr-md-4">
                <v-card flat border class="rounded-xl overflow-hidden bg-surface shadow-main">
                    <div class="d-flex flex-wrap pa-4 justify-center bg-card-sub border-b">
                        <div v-for="status in statusAulaOptions" :key="status.value" class="d-flex align-center mx-3">
                            <v-icon size="10" :color="status.color" class="mr-1">mdi-circle</v-icon>
                            <span class="text-caption font-weight-black opacity-60">{{ status.title }}</span>
                        </div>
                    </div>

                    <div class="calendar-header py-3 bg-card-sub border-b">
                        <div v-for="d in diasDaSemana" :key="d" class="text-center text-caption font-weight-black opacity-40">{{ d }}</div>
                    </div>

                    <div class="calendar-grid">
                        <div v-for="(d, index) in daysInMonth" :key="index" class="day-cell" :class="{'bg-vazio': !d.day}">
                            <template v-if="d.day">
                                <div class="d-flex justify-end mb-1">
                                    <span class="day-number">{{ d.day }}</span>
                                </div>
                                <div class="events-container">
                                    <div 
                                        v-for="aula in d.events" 
                                        :key="aula.idaula" 
                                        class="mini-event-card"
                                        :style="{ borderLeft: `3px solid ${getStatusColor(aula.status)}` }"
                                        @click.stop="abrirEdicaoParaForm(aula)"
                                    >
                                        <span class="text-truncate font-weight-bold" :style="{ color: getStatusColor(aula.status) }">
                                            {{ aula.horaInicio }} - {{ aula.observacoes }}
                                        </span>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="4" class="mt-6 mt-md-0">
                <div class="d-flex align-center mb-4">
                    <v-icon color="#ffb300" class="mr-2">mdi-format-list-bulleted</v-icon>
                    <h3 class="text-subtitle-1 font-weight-black text-uppercase">Agenda de Atividades</h3>
                </div>
                
                <v-card flat border class="rounded-xl pa-2 bg-surface">
                    <v-list lines="two" bg-color="transparent">
                        <v-list-item
                            v-for="aula in todasAsAulas"
                            :key="aula.idaula"
                            class="mb-2 rounded-lg item-agenda-hover"
                            :style="{ borderLeft: `5px solid ${getStatusColor(aula.status)} !important` }"
                            @click="abrirEdicaoParaForm(aula)"
                        >
                            <v-list-item-title class="font-weight-black text-body-2" :style="{ color: getStatusColor(aula.status) }">
                                {{ aula.observacoes || 'Aula Agendada' }}
                            </v-list-item-title>
                            <v-list-item-subtitle class="text-caption font-weight-medium">
                                {{ formatarData(aula.dataAula) }} • {{ aula.horaInicio }} - {{ aula.horaFim }}
                            </v-list-item-subtitle>
                        </v-list-item>

                        <div v-if="todasAsAulas.length === 0" class="pa-8 text-center opacity-50">
                            <v-icon size="40" class="mb-2">mdi-calendar-blank</v-icon>
                            <p class="text-caption">Nenhuma aula encontrada</p>
                        </div>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <AulasForm v-model="showForm" :is-editing="isEditing" :initial-data="selectedAula" @refresh="store.exibir" />
    </v-container>
</template>

<style scoped>
/* CORES E EFEITOS DAS IMAGENS */
.hero-banner {
    background: linear-gradient(135deg, #ffb300 0%, #fb910a 100%) !important;
    box-shadow: 0 8px 25px rgba(251, 145, 10, 0.3) !important;
}

.bg-card-sub {
    background-color: rgba(var(--v-border-color), 0.03);
}

.calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day-cell {
    min-height: 110px;
    padding: 8px;
    border-right: 1px solid rgba(var(--v-border-color), 0.08);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
    background-color: transparent;
    transition: background 0.2s;
}

.day-cell:hover:not(.bg-vazio) {
    background-color: rgba(255, 179, 0, 0.04);
}

.bg-vazio {
    background-color: rgba(var(--v-border-color), 0.01);
}

.day-number {
    font-size: 0.85rem;
    font-weight: 800;
    opacity: 0.6;
}

/* CARDS DE EVENTO NO CALENDÁRIO */
.mini-event-card {
    font-size: 0.65rem;
    padding: 4px 8px;
    background: rgba(var(--v-border-color), 0.05);
    border-radius: 4px;
    margin-bottom: 4px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mini-event-card:hover {
    background: rgba(var(--v-border-color), 0.1);
    transform: translateX(2px);
}

/* LISTA LATERAL */
.item-agenda-hover {
    background: rgba(var(--v-border-color), 0.03);
    border: 1px solid rgba(var(--v-border-color), 0.05) !important;
    transition: 0.3s;
}

.item-agenda-hover:hover {
    transform: translateY(-2px);
    background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
}

.shadow-main {
    box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
}
</style>