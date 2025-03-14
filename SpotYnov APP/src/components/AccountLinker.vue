<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useAuthStore } from '../stores/auth';



const emit = defineEmits(['update:accountLinkerVisible']);

const authStore = useAuthStore();
const spotifyData = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const spotifyUrl = ref('');

const apiUrl = import.meta.env.VITE_API_URL;

const retrieveSpotifyUrl = async () => {
  try {
    const response = await fetch(`${apiUrl}/auth/spotify/`, {
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

const linkSpotifyAccount = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await fetch(`${apiUrl}/auth/spotify/link_account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(JSON.parse(spotifyData.value)),
    });

    if (!response.ok) throw new Error('Erreur lors de la liaison du compte Spotify');
    console.log('Compte Spotify connecté avec succès !');
    emit('update:accountLinkerVisible', false);
  } catch (error) {
    errorMessage.value = 'Échec de la connexion Spotify. Vérifiez les données.';
  }
};

const unlinkSpotifyAccount = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await fetch(`${apiUrl}/auth/spotify/unlink_account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    });

    if (!response.ok) throw new Error('Erreur lors de la suppression du lien Spotify');
    console.log("Compte Spotify déconnecté avec succès !");
    emit('update:accountLinkerVisible', false);
  } catch (error) {
    errorMessage.value = 'Échec de la suppression du lien Spotify.';
  }
};
</script>

<template>
  <form class="account-linker fixed w-fit flex flex-col" @submit.prevent="linkSpotifyAccount">
    <a class="spotify-link" v-if="spotifyUrl" :href="spotifyUrl"  target="_blank">Récupérer mon token spotify</a>

    <input v-model="spotifyData"  type="text" placeholder='coller ici {data = { ... }}' required />
    <button type="submit" class="to-spotify-btn">Connecter mon compte Spotify</button>
    <button type="button" @click="unlinkSpotifyAccount" class="logout">Dissocier mon compte Spotify</button>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.account-linker {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: #191919;
  top: 70px;
  right: 10px;
  gap: 10px;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #9d9d9d;
  border-radius: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background: #1f1f1f;
  color: #9d9d9d;
  border-radius: 5px;
  transition: 1s !important;
}

.success {
  color: green;
}
.error {
  color: red;
}

.spotify-link {
  background: #303030;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
}


.logout{
  border: 3px solid #540000;
  border-radius: 8px;
}

.logout:hover{
  background: red;
  transition: 1s;
  border: 3px solid red;
}

.to-spotify-btn{
  border: 3px solid #004600;
  border-radius: 8px;
}

.to-spotify-btn:hover{
  background: #1DB954;
  border: 3px solid #1DB954;
  transition: 1s;
}

</style>
