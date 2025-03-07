<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../store/users';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

onMounted(() => {
  userStore.fetchUserById(route.params.id as string);
});
</script>

<template>
  <div v-if="userStore.userDetail">
    <h2>Profil de {{ userStore.userDetail.username }}</h2>
    <p>ID: {{ userStore.userDetail.id }}</p>
  </div>
  <div v-else>
    <p>Chargement du profil...</p>
  </div>
</template>
