<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCalendarioAulaStore } from '@/stores/calendarioAulaStores'; 
import { useFuncionarioStore } from '@/stores/funcionarioStore'; 

const calendarioAulaStore = useCalendarioAulaStore();
const funcionarioStore = useFuncionarioStore();

const aulasDoMes = computed(() => calendarioAulaStore.aulas);
const isLoading = computed(() => calendarioAulaStore.isLoading); 

const dataAtual = ref(new Date()); 
const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Cor padrão para o aluno (podemos usar o verde água ou o laranja do admin)
const COR_ALUNO = '#2fa99e'; 

function mudarMes(delta) {
    const novaData = new Date(dataAtual.value);
    novaData.setMonth(novaData.getMonth() + delta);
    dataAtual.value = novaData;
}

function buscarAulasPorDia(dataObjeto) {
    if (!aulasDoMes.value || aulasDoMes.value.length === 0) return [];

    const ano = dataObjeto.getFullYear();
    const mes = String(dataObjeto.getMonth() + 1).padStart(2, '0');
    const dia = String(dataObjeto.getDate()).padStart(2, '0');
    const dataStringCalendario = `${ano}-${mes}-${dia}`;

    return aulasDoMes.value.filter(aula => {
        const dataCampo = aula.dataaula || aula.dataAula;
        const dataAulaISO = dataCampo ? dataCampo.split('T')[0] : '';
        return dataAulaISO === dataStringCalendario;
    }).map(aula => {
        const profId = aula.idfuncionario || aula.idFuncionario;
        const professorObj = funcionarioStore.funcionarios?.find(f => f.idfuncionario === profId);
        
        return {
            ...aula,
            horainicio: (aula.horainicio || aula.horaInicio || '00:00').substring(0, 5),
            professorNome: professorObj ? professorObj.nome : 'Professor'
        };
    });
}

function getDiasDoMes() {
    const ano = anoDoCalendario.value;
    const mes = mesDoCalendario.value;
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const numDias = ultimoDia.getDate();
    const diaDaSemanaInicio = primeiroDia.getDay(); 
    
    const dias = [];
    for (let i = 0; i < diaDaSemanaInicio; i++) {
        dias.push({ isVazio: true });
    }

    const hoje = new Date().toLocaleDateString('pt-BR');
    
    for (let i = 1; i <= numDias; i++) {
        const dataDia = new Date(ano, mes, i);
        dias.push({ 
            isVazio: false, 
            numero: i, 
            isHoje: dataDia.toLocaleDateString('pt-BR') === hoje,
            aulas: buscarAulasPorDia(dataDia)
        });
    }

    while (dias.length % 7 !== 0) {
        dias.push({ isVazio: true });
    }
    return dias;
}

const mesDoCalendario = computed(() => dataAtual.value.getMonth());
const anoDoCalendario = computed(() => dataAtual.value.getFullYear());
const diasDoCalendario = computed(() => getDiasDoMes());

onMounted(async () => {
    if (funcionarioStore.exibir) await funcionarioStore.exibir(); 
    await calendarioAulaStore.exibir(); 
});

function abrirModalAula(aula) {
    // Aqui você pode substituir por um v-dialog futuramente
    alert(`Aula com: ${aula.professorNome}\nHorário: ${aula.horainicio}\nLocal: ${aula.sala || 'Não informado'}`);
}
</script>

<template>
    <v-container fluid class="pa-6 bg-background">
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-calendar rounded-xl pa-6 mb-6 d-flex align-center justify-space-between">
                    <div class="d-flex align-center">
                        <v-avatar color="rgba(255,255,255,0.2)" class="mr-4">
                            <v-icon color="white">mdi-calendar-month</v-icon>
                        </v-avatar>
                        <div>
                            <h2 class="text-h5 font-weight-black text-white text-uppercase">
                                {{ dataAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) }}
                            </h2>
                            <p class="text-caption text-white opacity-80 mb-0">Confira seus compromissos acadêmicos</p>
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <v-btn icon flat color="rgba(255,255,255,0.15)" class="text-white mr-2" @click="mudarMes(-1)">
                            <v-icon>mdi-chevron-left</v-icon>
                        </v-btn>
                        <v-btn icon flat color="rgba(255,255,255,0.15)" class="text-white" @click="mudarMes(1)">
                            <v-icon>mdi-chevron-right</v-icon>
                        </v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-card flat border class="rounded-xl overflow-hidden bg-surface">
            <v-row no-gutters class="text-center py-4 bg-card-sub border-b">
                <v-col v-for="dia in diasDaSemana" :key="dia" class="text-caption font-weight-black opacity-60 text-uppercase">
                    {{ dia }}
                </v-col>
            </v-row>
            
            <div v-if="isLoading" class="text-center pa-16">
                <v-progress-circular indeterminate color="#2fa99e" size="64"></v-progress-circular>
                <p class="mt-4 text-medium-emphasis font-weight-bold">Sincronizando sua agenda...</p>
            </div>

            <div v-else class="calendar-grid">
                <div 
                    v-for="(dia, index) in diasDoCalendario" 
                    :key="index"
                    class="calendar-day"
                    :class="{ 'is-vazio': dia.isVazio, 'is-hoje': dia.isHoje }"
                >
                    <div class="day-content" v-if="!dia.isVazio">
                        <div class="day-header">
                            <span class="day-number" :class="{ 'today-active': dia.isHoje }">
                                {{ dia.numero }}
                            </span>
                        </div>
                        
                        <div class="aulas-container">
                            <div 
                                v-for="aula in dia.aulas.slice(0, 3)" 
                                :key="aula.idaula"
                                class="aula-item"
                                @click.stop="abrirModalAula(aula)"
                            >
                                <div class="aula-dot"></div>
                                <span class="aula-text">
                                    <strong>{{ aula.horainicio }}</strong> {{ aula.professorNome.split(' ')[0] }}
                                </span>
                            </div>
                            
                            <div v-if="dia.aulas.length > 3" class="more-indicator">
                                +{{ dia.aulas.length - 3 }} atividades
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </v-card>
    </v-container>
</template>

<style scoped>
/* Estilo do Topo (Mesmo efeito Glow do Aluno) */
.hero-calendar {
    background: linear-gradient(135deg, #2fa99e 0%, #268a81 100%) !important;
    box-shadow: 0 10px 30px rgba(47, 169, 158, 0.3) !important;
}

.bg-card-sub {
    background-color: rgba(var(--v-border-color), 0.03);
}

.calendar-grid {
    display: flex;
    flex-wrap: wrap;
}

.calendar-day {
    flex: 0 0 14.2857%;
    max-width: 14.2857%;
    min-height: 130px;
    border-right: 1px solid rgba(var(--v-border-color), 0.08);
    border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
    background-color: transparent;
    transition: background 0.2s;
}

.calendar-day:hover:not(.is-vazio) {
    background-color: rgba(47, 169, 158, 0.05);
}

.is-vazio {
    background-color: rgba(var(--v-border-color), 0.02);
}

.is-hoje {
    background-color: rgba(47, 169, 158, 0.02);
}

.day-content {
    padding: 10px;
    height: 100%;
}

.day-header {
    margin-bottom: 8px;
}

.day-number {
    font-size: 0.9rem;
    font-weight: 800;
    opacity: 0.6;
}

.today-active {
    color: #2fa99e;
    opacity: 1;
    position: relative;
}

.today-active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #2fa99e;
    border-radius: 2px;
}

.aulas-container {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.aula-item {
    display: flex;
    align-items: center;
    background: rgba(var(--v-border-color), 0.05);
    padding: 4px 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
}

.aula-item:hover {
    transform: translateX(3px);
    background: rgba(47, 169, 158, 0.15);
}

.aula-dot {
    width: 6px;
    height: 6px;
    background-color: #2fa99e;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
}

.aula-text {
    font-size: 0.65rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
}

.more-indicator {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #2fa99e;
    margin-top: 2px;
    letter-spacing: 0.5px;
}

/* Ajustes Mobile */
@media (max-width: 600px) {
    .calendar-day {
        min-height: 80px;
    }
    .aula-text {
        display: none;
    }
    .aula-dot {
        margin-right: 0;
        width: 10px;
        height: 10px;
    }
}
</style>