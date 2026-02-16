import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useAvaliacaoStore = defineStore('avaliacao', {
    state: () => ({
        avaliacoes: []
    }),

    actions: {
        // GET - Buscar todas as avaliações
        async buscarTodos() {
            try {
                const response = await api.get('/Avaliacao/buscartodos');
                this.avaliacoes = response.data.data;
                return true;
            } catch (erro) {
                console.error("Erro ao carregar avaliações", erro);
                return false;
            }
        },

        // POST - Inserir Nova Avaliação
        async adicionar(dadosTela) {
            try {
                // Mapeando os campos da tela para o formato do Back-end
                const payload = {
                    idavaliacao: 0, // 0 indica novo registro
                    idalunoTurma: dadosTela.aluno_id,
                    idfuncionario: dadosTela.professor_id,
                    idturma: dadosTela.turma_id,
                    descricao: dadosTela.descricao || "",
                    titulo: dadosTela.titulo || "",
                    dataAvaliacao: dadosTela.data, // formato YYYY-MM-DD
                    nota: dadosTela.nota || 0,
                    peso: dadosTela.peso || 0,
                    observacao: dadosTela.obs || ""
                };

                const response = await api.post('/Avaliacao/inserir', payload);
                this.avaliacoes.push(response.data.data);
                return true;
            } catch (erro) {
                console.error("Erro ao inserir avaliação", erro);
                return false;
            }
        },

        // PUT - Atualizar Avaliação Existente
        async atualizar(id, dadosTela) {
            try {
                const payload = {
                    idavaliacao: id, // ID existente para atualizar
                    idalunoTurma: dadosTela.aluno_id,
                    idfuncionario: dadosTela.professor_id,
                    idturma: dadosTela.turma_id,
                    descricao: dadosTela.descricao,
                    titulo: dadosTela.titulo,
                    dataAvaliacao: dadosTela.data,
                    nota: dadosTela.nota,
                    peso: dadosTela.peso,
                    observacao: dadosTela.obs
                };

                await api.put('/Avaliacao/atualizar', payload);
                
                // Atualiza o item na lista local
                const index = this.avaliacoes.findIndex(a => a.idavaliacao === id);
                if (index !== -1) {
                    this.avaliacoes[index] = { ...this.avaliacoes[index], ...payload };
                }
                return true;
            } catch (erro) {
                console.error("Erro ao atualizar avaliação", erro);
                return false;
            }
        },

        // DELETE - Remover Avaliação
        async excluir(id) {
            try {
                await api.delete(`/Avaliacao/excluir/${id}`);
                this.avaliacoes = this.avaliacoes.filter(a => a.idavaliacao !== id);
                return true;
            } catch (erro) {
                console.error("Erro ao excluir avaliação", erro);
                return false;
            }
        }
    }
});