// import { defineStore } from 'pinia';
// import api from '@/plugins/axios';

// export const useAuthStore = defineStore('auth', {
//     state: () => ({
//         token: localStorage.getItem('token') || null,
//         user: null, 
//         userRole: null, 
//         loading: false,
//         error: null,
//     }),
    
//     actions: {
//         async login(credentials) {
//             this.loading = true;
//             this.error = null;
//             try {
//                 const response = await api.post('/usuario/login', credentials); 
//                 const result = response.data.data; 
                
//                 this.token = result.token;
//                 this.user = result.user; 
//                 this.userRole = result.user.papel; // Guarda 'aluno' ou 'funcionario'
                
//                 localStorage.setItem('token', result.token);
//                 return true;
//             } catch (e) {
//                 this.error = e.response?.data?.message || 'Erro ao entrar.';
//                 return false; 
//             } finally {
//                 this.loading = false;
//             }
//         }
//     }
// });
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        // Recupera o token e os dados básicos para manter o login ao atualizar a página
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null, 
        userRole: localStorage.getItem('userRole') || null, 
        loading: false,
        error: null,
    }),
    
    actions: {
        async login(credentials) {
            this.loading = true;
            this.error = null;
            try {
                // 'credentials' contém { cpf, senha } vindo do seu formulário
                const response = await api.post('/usuario/login', credentials); 
                
                // AJUSTE: Dependendo de como sua API retorna, pode ser response.data ou response.data.data
                const result = response.data; 

                // Mapeamento conforme o JSON de exemplo que você forneceu
                // Se a API retornar o objeto do usuário diretamente:
                this.token = result.token || 'token_temporario'; // Garante um token para o estado
                this.user = result; 
                this.userRole = result.papel; // Pega 'admin', 'aluno' ou 'funcionario'

                // Persistência para não deslogar ao dar F5
                localStorage.setItem('token', this.token);
                localStorage.setItem('userRole', this.userRole);
                localStorage.setItem('user', JSON.stringify(this.user));

                return true;
            } catch (e) {
                console.error("Erro no login:", e);
                // Captura a mensagem de erro vinda do C# (Unauthorized/BadRequest)
                this.error = e.response?.data?.message || 'Credenciais inválidas ou erro de conexão.';
                return false; 
            } finally {
                this.loading = false;
            }
        },

        logout() {
            // Limpa o estado e o armazenamento local
            this.token = null;
            this.user = null;
            this.userRole = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('user');
        }
    }
});