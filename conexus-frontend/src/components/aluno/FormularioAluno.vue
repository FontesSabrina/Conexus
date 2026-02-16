<script setup>
import { ref } from 'vue';
import { useContatoStore } from '@/stores/contatoStores'; 

const contatoStore = useContatoStore(); 

const email = ref('');
const telefone = ref('');
const matricula = ref('');
const motivo = ref(null);
const mensagem = ref('');
const arquivo = ref(null);

const contactInfo = ref({
    telefone: '(32) 99999-9999',
    email: 'contato@conexus.com.br',
    endereco: 'Av. Principal, 1234 - Centro - Muriaé/MG'
});

const snackbar = ref(false);
const snackbarTexto = ref('');
const snackbarCor = ref('success');
const formValido = ref(true);
const isLoading = ref(false);

const motivos = ref([
    'Dúvida Financeira',
    'Suporte Técnico',
    'Sugestão/Reclamação',
    'Informações Sobre Cursos',
    'Outro Assunto',
]);

const regraObrigatoria = [(v) => !!v || 'Campo obrigatório'];

async function enviarFormulario() {
    isLoading.value = true;

    if (!formValido.value) {
        snackbarTexto.value = 'Preencha todos os campos obrigatórios!';
        snackbarCor.value = 'error';
        snackbar.value = true;
        isLoading.value = false;
        return;
    }

    try {
        const sucesso = await contatoStore.enviarMensagem({
            email: email.value,
            telefone: telefone.value,
            matricula: matricula.value,
            motivo: motivo.value,
            mensagem: mensagem.value,
            arquivo: arquivo.value 
        });

        if (sucesso) {
            snackbarTexto.value = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
            snackbarCor.value = 'success';
            email.value = '';
            telefone.value = '';
            matricula.value = '';
            motivo.value = null;
            mensagem.value = '';
            arquivo.value = null;
        } else {
            throw new Error(contatoStore.error || 'Erro desconhecido ao enviar.');
        }

    } catch (erro) {
        snackbarTexto.value = `Erro: ${erro.message || 'Tente novamente.'}`;
        snackbarCor.value = 'error';
    } finally {
        snackbar.value = true;
        isLoading.value = false;
    }
}
</script>

<template>
    <v-container fluid class="pa-6 bg-background min-h-screen">
        
        <v-row>
            <v-col cols="12">
                <v-card flat class="hero-conexus rounded-xl pa-8 mb-6 position-relative overflow-hidden">
                    <div class="deco-circle"></div>
                    <v-row align="center" class="position-relative z-index-1">
                        <v-col cols="12" md="8">
                            <div class="d-flex align-center">
                                <v-avatar color="rgba(255,255,255,0.2)" size="64" class="mr-4 backdrop-blur shadow-soft">
                                    <v-icon color="white" size="32">mdi-headphones-service</v-icon>
                                </v-avatar>
                                <div>
                                    <h1 class="text-h4 font-weight-black text-white mb-1">Central de Atendimento</h1>
                                    <p class="text-subtitle-1 text-white opacity-80 font-weight-light">
                                        Estamos aqui para ajudar. Envie sua dúvida ou sugestão.
                                    </p>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="8">
                <v-card class="rounded-xl pa-6 shadow-main border-0" elevation="0" border>
                    <v-card-title class="text-h5 font-weight-bold text-conexus px-0 mb-4">
                        <v-icon start color="#2fa99e">mdi-send-circle</v-icon>
                        Envie Sua Mensagem
                    </v-card-title>
                    
                    <v-form v-model="formValido" @submit.prevent="enviarFormulario">
                        <v-row>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="email" 
                                    :rules="regraObrigatoria"
                                    label="Seu Email" 
                                    prepend-inner-icon="mdi-email-outline" 
                                    variant="outlined"
                                    color="#2fa99e"
                                    class="rounded-lg"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="telefone" 
                                    label="Telefone (Opcional)" 
                                    prepend-inner-icon="mdi-phone-outline" 
                                    variant="outlined"
                                    color="#2fa99e"
                                    class="rounded-lg"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field 
                                    v-model="matricula" 
                                    :rules="regraObrigatoria"
                                    label="Número de Matrícula" 
                                    prepend-inner-icon="mdi-badge-account-outline" 
                                    variant="outlined"
                                    color="#2fa99e"
                                    class="rounded-lg"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select
                                    v-model="motivo"
                                    :rules="regraObrigatoria"
                                    :items="motivos"
                                    label="Motivo do Contato"
                                    prepend-inner-icon="mdi-format-list-bulleted"
                                    variant="outlined"
                                    color="#2fa99e"
                                    class="rounded-lg"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea
                                    v-model="mensagem"
                                    :rules="regraObrigatoria"
                                    label="Descreva sua solicitação"
                                    prepend-inner-icon="mdi-message-text-outline"
                                    variant="outlined"
                                    color="#2fa99e"
                                    rows="4"
                                    class="rounded-lg"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-file-input
                                    v-model="arquivo"
                                    label="Anexar Arquivo (Opcional)"
                                    prepend-inner-icon="mdi-paperclip"
                                    variant="outlined"
                                    color="#2fa99e"
                                    chips
                                    show-size
                                    class="rounded-lg"
                                ></v-file-input>
                            </v-col>
                            <v-col cols="12" class="text-right">
                                <v-btn 
                                    type="submit" 
                                    color="#2fa99e" 
                                    size="x-large"
                                    elevation="2"
                                    class="rounded-xl px-8 font-weight-bold text-white"
                                    :disabled="!formValido || isLoading"
                                    :loading="isLoading"
                                >
                                    Enviar Solicitação
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-row>
                    <v-col cols="12">
                        <v-card class="rounded-xl pa-6 shadow-main border-0 hover-card" border>
                            <v-avatar color="teal-lighten-5" size="48" class="mb-4">
                                <v-icon color="#2fa99e">mdi-whatsapp</v-icon>
                            </v-avatar>
                            <div class="text-caption font-weight-bold text-uppercase opacity-60">Fale conosco</div>
                            <div class="text-h6 font-weight-black text-conexus">{{ contactInfo.telefone }}</div>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <v-card class="rounded-xl pa-6 shadow-main border-0 hover-card" border>
                            <v-avatar color="teal-lighten-5" size="48" class="mb-4">
                                <v-icon color="#2fa99e">mdi-email-check-outline</v-icon>
                            </v-avatar>
                            <div class="text-caption font-weight-bold text-uppercase opacity-60">Suporte por e-mail</div>
                            <div class="text-h6 font-weight-black text-conexus">{{ contactInfo.email }}</div>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <v-card class="rounded-xl pa-6 shadow-main border-0 hover-card" border>
                            <v-avatar color="teal-lighten-5" size="48" class="mb-4">
                                <v-icon color="#2fa99e">mdi-map-marker-radius-outline</v-icon>
                            </v-avatar>
                            <div class="text-caption font-weight-bold text-uppercase opacity-60">Endereço Físico</div>
                            <div class="text-body-1 font-weight-bold">{{ contactInfo.endereco }}</div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :timeout="4000" :color="snackbarCor" rounded="pill" elevation="24">
            <v-icon start>{{ snackbarCor === 'success' ? 'mdi-check-circle' : 'mdi-alert' }}</v-icon>
            {{ snackbarTexto }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar = false">OK</v-btn>
            </template>
        </v-snackbar>

    </v-container>
</template>

<style scoped>
/* BANNER TEMA #2fa99e */
.hero-conexus {
    background: linear-gradient(135deg, #2fa99e 0%, #1e7a72 100%) !important;
    box-shadow: 0 10px 30px rgba(47, 169, 158, 0.3) !important;
}

.text-conexus {
    color: #2fa99e !important;
}

.deco-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    width: 300px;
    height: 300px;
    top: -100px;
    right: -50px;
}

.shadow-main {
    box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important;
    transition: all 0.3s ease;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(47, 169, 158, 0.15) !important;
}

.backdrop-blur {
    backdrop-filter: blur(10px);
}

.z-index-1 {
    z-index: 1;
}

:deep(.v-field--outlined.v-field--focused .v-outline__separator) {
    color: #2fa99e !important;
}
</style>