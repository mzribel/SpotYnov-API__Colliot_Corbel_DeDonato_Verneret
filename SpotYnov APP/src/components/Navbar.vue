<script setup lang="ts">
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/');
};

const connectSpotify = () => {
  window.location.href = 'http://localhost:3000/auth/spotify/auth';
};
</script>

<template>
  <nav class="navbar">
    <div class="logo">🎵 SpotYnov</div>
    <div class="nav-links" v-if="authStore.isAuthenticated">
      <span>Bienvenue, {{ authStore.username }}</span>
      <button @click="connectSpotify">🎧 Connexion Spotify</button>
      <button @click="logout">🚪 Déconnexion</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background: #1DB954;
  color: white;
}
.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}
button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background: white;
  color: #1DB954;
  border-radius: 5px;
}
button:hover {
  background: #f1f1f1;
}
</style>
