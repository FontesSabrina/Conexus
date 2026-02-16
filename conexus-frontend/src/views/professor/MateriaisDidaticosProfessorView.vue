<script setup>

import TabelaMateriais from '@/components/professor/TabelaMateriais.vue'; 
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessotNavbar from '@/components/professor/ProfessotNavbar.vue';
// Certifique-se que o caminho de importação está correto.
</script>

<template>
    <v-app>
        <ProfessorSidebar/>
        <ProfessotNavbar/>
        <v-main>
            <v-container fluid class="pa-6">
                <TabelaMateriais/>
            </v-container>
        </v-main>
    </v-app>
</template>