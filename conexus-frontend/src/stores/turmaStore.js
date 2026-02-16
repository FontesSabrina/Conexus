import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useTurmaStore = defineStore("turma", {
  state: () => ({
    turmas: []
  }),

  actions: {

    async exibir() {
      try {
        const res = await api.get('/Turma/BuscarTodos');
        

        const listaOriginal = res.data.data || [];

        this.turmas = listaOriginal.map(item => ({
          idturma: item.idturma,
          descricao: item.descricao,
          sala: item.sala || 'N/A',
          idioma: item.idiomaDescricao,
          nivel: item.nivelDescricao,
          professor: item.nomeFuncionario,
          horario: item.horaInicio,
          diasSemana: item.diasSemana
        }));

        console.log("Turmas carregadas com sucesso");
        return true;
      } catch (erro) {
        console.error("Erro ao carregar turmas:", erro);
        return false;
      }
    },


    async adicionar(turma) {
      try {

        const payload = {
          idturma: 0, 
          ididioma: Number(turma.ididioma), 
          idnivel: Number(turma.idnivel), 
          idfuncionario: Number(turma.idfuncionario), 
          descricao: turma.descricao,
          diassemana: turma.diassemana,
          horaInicio: turma.horainicio || "12:00:00", 
          capacidadeMaxima: Number(turma.capacidadeMaxima),
          sala: turma.sala,
          imagem: turma.imagem || "",
          tipoRecorrencia: turma.tipoRecorrencia || "Semanal",
  
        };

        const res = await api.post("/Turma/inserir", payload);
        
        await this.exibir();
        return true;
      } catch (error) {

        if (error.response && error.response.data) {
          console.error("Detalhes do erro 400 do servidor:", error.response.data);
        }
        return false;
      }
    },

    async atualizar(idturma, turma) {
      try {
        const payload = {
          idturma: Number(idturma),
          ididioma: Number(turma.ididioma), 
          idnivel: Number(turma.idnivel),
          idfuncionario: Number(turma.idfuncionario),
          descricao: turma.descricao,
          diassemana: turma.diassemana,
          horainicio: turma.horainicio,
          capacidadeMaxima: Number(turma.capacidadeMaxima),
          sala: turma.sala,
          imagem: turma.imagem,
          tiporecorrencia: turma.tiporecorrencia
        };

        await api.put("/Turma/atualizar", payload);
        await this.exibir();
        return true;
      } catch (error) {
        console.error("Erro ao atualizar turma:", error);
        return false;
      }
    },

    async apagar(idturma) {
      try {
        await api.delete(`/Turma/excluir/${idturma}`);
        this.turmas = this.turmas.filter(t => t.idturma !== idturma);
        return true;
      } catch (error) {
        console.error("Erro ao apagar turma:", error);
        return false;
      }
    }
  }
});