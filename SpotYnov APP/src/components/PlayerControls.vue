<script setup lang="ts">
import { ref } from 'vue';
import { useSpotifyStore } from '../store/spotify';

const spotifyStore = useSpotifyStore();
const trackUri = ref('');

const play = () => {
  if (trackUri.value.trim()) {
    spotifyStore.playTrack(trackUri.value);
    trackUri.value = ''; // Réinitialiser le champ après envoi
  }
};
</script>

<template>
  <div class="player-controls">
    <h2>🎧 Lecture d'un morceau</h2>
    <input v-model="trackUri" placeholder="Spotify URI (ex: spotify:track:xxxxx)" />
    <button @click="play">▶️ Jouer</button>
  </div>
</template>

<style scoped>
.player-controls {
  text-align: center;
  margin-top: 20px;
}
input {
  padding: 10px;
  width: 80%;
}
button {
  padding: 10px;
  background: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
