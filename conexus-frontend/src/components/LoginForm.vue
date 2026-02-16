<script setup>
    import { ref } from 'vue';
    import { useAuthStore } from '@/stores/authStore';
    import { useRouter } from 'vue-router';

    const authStore = useAuthStore();
    const router = useRouter();

    const showPassword = ref(false); 

    const dadosFormulario = ref({
        cpf: "",
        senha: ""
    });

    async function handleLogin() {
        const success = await authStore.login(dadosFormulario.value); 

        if (success) {
            const role = authStore.userRole; 
            let redirectRoute = '/'; 

            if (role === 'admin') {
                redirectRoute = '/admin/dashboard';
            } else if (role === 'aluno') {
                redirectRoute = '/aluno/dashboard';
            } else if (role === 'funcionario') { 
                redirectRoute = '/professor/materiais'; 
            }

            await router.push(redirectRoute);
        }
    }
</script>

<template>
    <div class="login-wrapper">
        <v-form @submit.prevent="handleLogin" class="login-form">
            <div class="logo-container">
                <v-avatar size="120" class="mb-4 shadow-soft bg-white">
                    <img src="/src/assets/img/2025.png" alt="Logo Conexus" class="logo-puzzle">
                </v-avatar>
                <h1 class="text-h5 font-weight-black text-grey-darken-3">Bem-vindo</h1>
                <p class="text-caption text-grey-darken-1 mb-8">Acesse o portal Conexus com suas credenciais</p>
            </div>

            <div class="input-group">
                <label class="text-caption font-weight-bold text-uppercase tracking-wide text-grey-darken-2 ml-1">
                    Seu CPF <span class="text-orange-darken-2">*</span>
                </label>
                <v-text-field 
                    v-model="dadosFormulario.cpf" 
                    placeholder="000.000.000-00" 
                    variant="solo" 
                    flat
                    density="comfortable" 
                    hide-details 
                    prepend-inner-icon="mdi-account-outline"
                    class="custom-input mb-4 shadow-sm" 
                    :loading="authStore.loading"
                    autofocus
                ></v-text-field>
            </div>

            <div class="input-group">
                <label class="text-caption font-weight-bold text-uppercase tracking-wide text-grey-darken-2 ml-1">
                    Sua Senha <span class="text-orange-darken-2">*</span>
                </label>
                <v-text-field 
                    v-model="dadosFormulario.senha" 
                    placeholder="Digite sua senha" 
                    :type="showPassword ? 'text' : 'password'" 
                    variant="solo" 
                    flat
                    density="comfortable" 
                    hide-details 
                    prepend-inner-icon="mdi-lock-outline"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                    class="custom-input mb-6 shadow-sm" 
                    :loading="authStore.loading"
                ></v-text-field>
            </div>

            <v-btn 
                type="submit" 
                block 
                size="x-large" 
                color="#FF8C36" 
                class="login-btn rounded-lg text-white font-weight-black"
                elevation="4" 
                :loading="authStore.loading" 
                :disabled="authStore.loading"
            >
                ACESSAR PORTAL
            </v-btn>

            <v-expand-transition>
                <v-alert 
                    v-if="authStore.error" 
                    type="error" 
                    class="mt-6 border-l-xl rounded-lg" 
                    density="compact"
                    variant="tonal"
                >
                    <template v-slot:prepend>
                        <v-icon size="small">mdi-alert-circle</v-icon>
                    </template>
                    <span class="text-caption font-weight-bold">{{ authStore.error }}</span>
                </v-alert>
            </v-expand-transition>
            
            <div class="text-center mt-10 opacity-40">
                <p class="text-caption font-weight-bold">CONEXUS &copy; 2025</p>
            </div>
        </v-form>
    </div>
</template>

<style scoped>
    .login-wrapper {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }

    .logo-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .logo-puzzle {
        width: 80%;
        height: auto;
        object-fit: contain;
    }

    .custom-input :deep(.v-field) {
        background-color: #f8f9fa !important;
        border: 1.5px solid #eceff1 !important;
        border-radius: 12px !important;
        transition: all 0.2s ease-in-out;
    }

    .custom-input :deep(.v-field--focused) {
        border-color: #FF8C36 !important;
        background-color: #ffffff !important;
        box-shadow: 0 0 0 4px rgba(255, 140, 54, 0.1) !important;
    }

    .custom-input :deep(.v-field__input) {
        font-weight: 500;
        color: #455a64;
    }

    .login-btn {
        letter-spacing: 1px;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .login-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(255, 140, 54, 0.3) !important;
    }

    .shadow-soft {
        box-shadow: 0 8px 24px rgba(0,0,0,0.05) !important;
    }

    .shadow-sm {
        box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
    }

    .login-form {
        animation: slideIn 0.5s ease-out;
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>