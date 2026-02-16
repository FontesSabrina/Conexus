<script setup>
import AulasFrom from '@/components/professor/AulasFrom.vue';
import ProfessorSidebar from '@/components/professor/ProfessorSidebar.vue';
import ProfessotNavbar from '@/components/professor/ProfessotNavbar.vue';
</script>

<template>
    <v-app>
        <ProfessorSidebar/>
        <ProfessotNavbar/>
        <v-main>
            <AulasFrom/>
            <v-container fluid class="pa-6">
            </v-container>
        </v-main>
    </v-app>
</template>