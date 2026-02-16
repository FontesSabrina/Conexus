
import { defineStore } from "pinia";
import api from '@/plugins/axios'


const formatarDadosAula = (aula) => ({
    ...aula,

    idaula: aula.idaula || aula.idAula,
    dataaula: aula.dataAula || aula.dataaula, 
    horainicio: aula.horaInicio || aula.horainicio,
    horafim: aula.horaFim || aula.horafim
});

export const useCalendarioAulaStore = defineStore('calendarioAula', {
    state: () => ({
        aulas: [],
        isLoading: false, 
    }),

    actions: {
        async exibir() {
            this.isLoading = true;
            try {
                
                const response = await api.get('/CalendarioAula/buscartodos');
                const listaBruta = response.data.data || [];
                this.aulas = listaBruta.map(aula => formatarDadosAula(aula));
                
                console.log("Aulas carregadas:", this.aulas);
                return true;
            } catch (erro) {
                console.error("Erro ao carregar calendário:", erro);
                return false;
            } finally {
                this.isLoading = false;
            }
        },

async adicionar(aula) {
    try {
        const payload = {
            dataAula: aula.dataAula,   
            horaInicio: aula.horaInicio,
            horaFim: aula.horaFim,
            idfuncionario: aula.idfuncionario,
            idturma: aula.idturma,
            idmaterial: aula.idmaterial,
            sala: aula.sala,
            observacoes: aula.observacoes,
            linkReuniao: aula.linkReuniao,
            aulaExtra: !!aula.aulaExtra 
        };

        const response = await api.post('/CalendarioAula/inserir', payload);
        
        if (response.data) {
            await this.exibir();
            return true;
        }
    } catch (erro) {
        console.error("Erro ao inserir aula", erro.response?.data || erro);
        return false;
    }
},

        async deleteAula(id) {
            try {
                await api.delete(`/CalendarioAula/excluir/${id}`);
                this.aulas = this.aulas.filter(item => (item.idaula || item.idAula) !== id);
                return true;
            } catch (erro) {
                console.error("Erro ao apagar aula", erro);
                return false;
            }
        }
    }
});