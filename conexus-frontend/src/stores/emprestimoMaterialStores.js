import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useEmprestimoMaterialStore =
defineStore('emprestimoMaterial', {
    state:() => ({
        emprestimos: []
    }),

    actions: {

        async exibir(){
            try{
                const dados = await api.get(
                    '/EmprestimoMaterial/buscartodos'
                );
                this.emprestimos = dados.data.data;
                console.log("Dados de EmprestimoMaterial carregados", dados);
                return true;
            }catch(erro){
                console.log("Erro ao carregar os dados de EmprestimoMaterial", erro);
                return false;
            }
        },


        async adicionar(emprestimo){
            try{
                const dados = await api.post('/EmprestimoMaterial/inserir', {
                    idemprestimo: 0,
                    idaluno: emprestimo.idaluno,
                    idmaterial: emprestimo.idmaterial,
                    dataEmprestimo: emprestimo.dataEmprestimo,
                    dataPrevistaDevolucao: emprestimo.dataPrevistaDevolucao,
                    dataDevolvido: emprestimo.dataDevolvido,
                    status: emprestimo.status,
                    observacoes: emprestimo.observacoes,
                    valorMulta: emprestimo.valorMulta
                });

                this.emprestimos.push(dados.data.data);
                return true;
            }catch(erro){
                console.log("Erro ao inserir EmprestimoMaterial", erro);
                return false;
            }
        },

        async atualizar(id, emprestimo){
            try{
                const dados = await api.put('/EmprestimoMaterial/atualizar',{
                    idemprestimo: id,
                    idaluno: emprestimo.idaluno,
                    idmaterial: emprestimo.idmaterial,
                    dataEmprestimo: emprestimo.dataEmprestimo,
                    dataPrevistaDevolucao: emprestimo.dataPrevistaDevolucao,
                    dataDevolvido: emprestimo.dataDevolvido,
                    status: emprestimo.status,
                    observacoes: emprestimo.observacoes,
                    valorMulta: emprestimo.valorMulta
                });


                const index = this.emprestimos.findIndex(item => item.idemprestimo === id);
                if(index!==-1){
                    this.emprestimos[index] = { ...this.emprestimos[index], ...dados.data.data};
                }
                return true;
            }catch(erro){
                console.log("Erro ao alterar EmprestimoMaterial", erro);
                return false;
            }
        },


        async apagar(id){
            try{
                await api.delete(`/EmprestimoMaterial/excluir/${id}`); 

                this.emprestimos = this.emprestimos.filter(item =>
                    item.idemprestimo !== id);

                return true;
            }catch(erro){
                console.log("Erro ao apagar EmprestimoMaterial", erro);
                return false;
            }
        }
    }
})