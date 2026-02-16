<script setup>
import AulasCalendario from '@/components/professor/AulasCalendario.vue'
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessorNavbar from '@/components/professor/ProfessotNavbar.vue';
</script>

<template>
    <v-app>
        <ProfessorSidebar/>
        <ProfessorNavbar/>
        <v-main>
            <AulasCalendario/>
            <v-container fluid class="pa-6">
            </v-container>
        </v-main>
    </v-app>
</template>