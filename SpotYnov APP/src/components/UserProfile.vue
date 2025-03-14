<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/users';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchSpotifyUserById("me");
});
</script>

<template>
  <div v-if="userStore.userDetail">
    {{ userStore.userDetail }}
  </div>
  <div v-else>
    <p>Chargement du profil...</p>
  </div>
</template>
