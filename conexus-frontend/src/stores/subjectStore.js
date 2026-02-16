

import { defineStore } from "pinia";
import api from '@/plugins/axios'

export const useSubjectStore = defineStore('subject', {
    state: () => ({

        subjects: [],
    }),

    actions: {
        async fetchSubjects() {
            if (this.subjects.length > 0) return; 

            try {
                const response = await api.get('/disciplinas'); 
                this.subjects = response.data; 
                console.log("Disciplinas carregadas com sucesso.");
                return true;
            } catch (erro) {
                console.error("Erro ao carregar a lista de disciplinas.", erro);
                return false;
            }
        },
    }
});