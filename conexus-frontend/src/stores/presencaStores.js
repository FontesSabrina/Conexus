import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const usePresencaStore = defineStore('presenca', {
    state: () => ({
        presencas: [] 
    }),

    actions: {

        async buscarTodos() {
            try {
                const response = await api.get('/Presenca/buscartodos');
                this.presencas = response.data.data;
                return true;
            } catch (erro) {
                console.error("Erro ao carregar presenças", erro);
                return false;
            }
        },

        async buscarPresencasPorAula(idAula) {
            try {
                const response = await api.get(`/Presenca/buscarporaula/${idAula}`);
                return response.data; 
            } catch (erro) {
                console.error(`Erro ao buscar presenças para a aula ${idAula}`, erro);
                return [];
            }
        },


        async adicionar(presenca) {
            try {
                const payload = {
                    idpresenca: 0,
                    idalunoTurma: presenca.idalunoTurma,
                    idfuncionario: presenca.idfuncionario,
                    presente: presenca.presente, 
                    data: presenca.data 
                };

                const response = await api.post('/Presenca/inserir', payload);
                this.presencas.push(response.data.data);
                return true;
            } catch (erro) {
                console.error("Erro ao inserir presença", erro);
                return false;
            }
        },

        async registrarPresencas(registrosPresenca) {
            try {
                const response = await api.post('/Presenca/registrar', registrosPresenca);
                console.log("Presenças registradas com sucesso!", response.data);
                return true;
            } catch (erro) {
                console.error("Erro ao registrar presenças", erro);
                return false;
            }
        },


        async atualizar(id, presenca) {
            try {
                const payload = {
                    idpresenca: id,
                    idalunoTurma: presenca.idalunoTurma,
                    idfuncionario: presenca.idfuncionario,
                    presente: presenca.presente,
                    data: presenca.data
                };

                const response = await api.put('/Presenca/atualizar', payload);

                // Atualiza na lista local
                const index = this.presencas.findIndex(p => p.idpresenca === id);
                if (index !== -1) {
                    this.presencas[index] = { ...this.presencas[index], ...payload };
                }
                return true;
            } catch (erro) {
                console.error("Erro ao atualizar presença", erro);
                return false;
            }
        },

        async apagar(id) {
            try {
                await api.delete(`/Presenca/excluir/${id}`);
                this.presencas = this.presencas.filter(p => p.idpresenca !== id);
                return true;
            } catch (erro) {
                console.error("Erro ao apagar presença", erro);
                return false;
            }
        }
    }
});