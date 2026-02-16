<script setup>
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessorNavbar from '@/components/professor/ProfessotNavbar.vue';
import TabelaNotas from '@/components/professor/TabelaNotas.vue';
</script>

<template>
    <v-app>
        <ProfessorSidebar/>
        <ProfessorNavbar/>

        <v-main class="bg-background">
            <v-container fluid class="pa-6">
                <TabelaNotas/>
            </v-container>
        </v-main>
    </v-app>
</template>