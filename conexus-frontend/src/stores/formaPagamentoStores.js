import { defineStore } from "pinia";
import api from '@/plugins/axios'

// Alterado o nome de usePagamentoStore para useFormaPagamentoStore para bater com seu import
export const useFormaPagamentoStore = defineStore('pagamento', {
    state: () => ({
        pagamentos: []
    }),

    actions: {
        // GET - Listar todos os pagamentos
        async exibir() {
            try {
                const dados = await api.get('/Pagamento/buscartodos');
                this.pagamentos = dados.data.data;
                return true;
            } catch (erro) {
                console.error("Erro ao carregar os pagamentos", erro);
                return false;
            }
        },

        // POST - Adicionar novo pagamento
        async adicionar(pagamento) {
            try {
                const payload = {
                    idpagamento: 0,
                    idformaPagamento: pagamento.idformaPagamento,
                    idaluno: pagamento.idaluno,
                    valor: pagamento.valor,
                    dataVencimento: pagamento.dataVencimento, 
                    statusPagamento: pagamento.statusPagamento || "Pendente",
                    dataPagamento: pagamento.dataPagamento || null,
                    valorPago: pagamento.valorPago || 0,
                    observacoes: pagamento.observacoes || "",
                    multa: pagamento.multa || 0
                };

                const dados = await api.post('/Pagamento/inserir', payload);
                this.pagamentos.push(dados.data.data);
                return true;
            } catch (erro) {
                console.error("Erro ao inserir o pagamento", erro);
                return false;
            }
        },

        // PUT - Atualizar pagamento existente
        async atualizar(id, pagamento) {
            try {
                const payload = {
                    idpagamento: id,
                    idformaPagamento: pagamento.idformaPagamento,
                    idaluno: pagamento.idaluno,
                    valor: pagamento.valor,
                    dataVencimento: pagamento.dataVencimento,
                    statusPagamento: pagamento.statusPagamento,
                    dataPagamento: pagamento.dataPagamento,
                    valorPago: pagamento.valorPago,
                    observacoes: pagamento.observacoes,
                    multa: pagamento.multa
                };

                const dados = await api.put('/Pagamento/atualizar', payload);

                const index = this.pagamentos.findIndex(item => item.idpagamento === id);
                if (index !== -1) {
                    this.pagamentos[index] = { ...this.pagamentos[index], ...dados.data.data };
                }
                return true;
            } catch (erro) {
                console.error("Erro ao alterar o pagamento", erro);
                return false;
            }
        },

        // DELETE - Remover pagamento
        async apagar(id) {
            try {
                await api.delete(`/Pagamento/excluir/${id}`);
                this.pagamentos = this.pagamentos.filter(item => item.idpagamento !== id);
                return true;
            } catch (erro) {
                console.error("Erro ao apagar o pagamento", erro);
                return false;
            }
        }
    }
});