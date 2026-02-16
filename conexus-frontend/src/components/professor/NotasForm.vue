<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// --- CONFIGURAÇÕES DE NEGÓCIO ---
const NOTA_MINIMA_APROVACAO = 7.0;
const NOTA_MINIMA_RECUPERACAO = 5.0; 

// --- DADOS ESTÁTICOS (MOCK) ---
const MOCK_TURMAS = [
    { idturma: 1, sala: 'Sala 101', idioma: { nome: 'Inglês Iniciante' } },
    { idturma: 2, sala: 'Sala 202', idioma: { nome: 'Espanhol Intermediário' } },
    { idturma: 3, sala: 'Lab 01', idioma: { nome: 'Francês Avançado' } }
];

const MOCK_ALUNOS_POR_TURMA = {
    1: [
        { idaluno: 101, nome: 'Ana Silva', nota1: 8.5, nota2: 7.0 },
        { idaluno: 102, nome: 'Bruno Oliveira', nota1: 4.0, nota2: 5.5 },
        { idaluno: 103, nome: 'Carla Souza', nota1: 2.0, nota2: 3.0 }
    ],
    2: [
        { idaluno: 201, nome: 'Diego Santos', nota1: 9.0, nota2: 10 },
        { idaluno: 202, nome: 'Eduarda Lima', nota1: 6.0, nota2: 6.5 }
    ],
    3: [
        { idaluno: 301, nome: 'Fabio Junior', nota1: 0, nota2: 0 }
    ]
};

// --- ESTADOS ---
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

// Mapeia turmas para o select
const turmasOptions = computed(() => {
    return MOCK_TURMAS.map(t => ({
        title: `${t.sala} - ${t.idioma.nome}`, 
        value: t.idturma
    }));
});

// --- LÓGICA DE CÁLCULO ---
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

// --- AÇÕES SIMULADAS ---
async function buscarAlunosENotas() {
    if (!turmaSelecionada.value) {
        listaAlunosComNotas.value = [];
        return;
    }
    
    estaCarregando.value = true;
    
    // Simula delay de rede (800ms)
    setTimeout(() => {
        listaAlunosComNotas.value = MOCK_ALUNOS_POR_TURMA[turmaSelecionada.value] || [];
        estaCarregando.value = false;
    }, 800);
}

async function salvarNotas() {
    if (!turmaSelecionada.value || alunosComStatus.value.length === 0) return;
    
    estaSalvando.value = true;
    
    // Simula salvamento
    setTimeout(() => {
        console.log("Dados que seriam salvos:", alunosComStatus.value);
        alert("Notas salvas (Simulação)!");
        estaSalvando.value = false;
    }, 1000);
}

watch(turmaSelecionada, buscarAlunosENotas);

onMounted(() => {
    // Simula o carregamento inicial das turmas
    console.log("Componente montado com dados estáticos.");
});
</script>