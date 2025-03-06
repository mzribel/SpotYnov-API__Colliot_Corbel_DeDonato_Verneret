<script setup lang="ts">
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import {onMounted, ref} from "vue";
import AccountLinker from "./AccountLinker.vue";

const authStore = useAuthStore();
const router = useRouter();

const spotifyUrl = ref('');
const accountLinkerVisible = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/');
};

const retrieveSpotifyUrl = async () => {
  try {
    const response = await fetch('http://localhost:3000/auth/spotify/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    });

    if (!response.ok) throw new Error('Erreur lors de la récupération de l’URL Spotify');

    const data = await response.json();
    if (data.data.url) {
      spotifyUrl.value = data.data.url;
    } else {
      throw new Error('URL non reçue');
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Impossible de se connecter à Spotify');
  }
};

onMounted( async () => {
  if (authStore.isAuthenticated) {
    await retrieveSpotifyUrl();
  }
});
</script>

<template>
  <nav class="navbar">
    <div class="logo">🎵 SpotYnov</div>
    <div class="nav-links" v-if="authStore.isAuthenticated">
      <span>Bienvenue, {{ authStore.username }}</span>
      <a class="spotify-link" v-if="spotifyUrl" :href="spotifyUrl"  @click="()=>{accountLinkerVisible = !accountLinkerVisible}" target="_blank">🎧 Connexion Spotify</a>
      <button @click="logout">🚪 Déconnexion</button>
    </div>
    <AccountLinker v-if="accountLinkerVisible" />
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
.spotify-link {
  background: #1DB954;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
}
</style>
