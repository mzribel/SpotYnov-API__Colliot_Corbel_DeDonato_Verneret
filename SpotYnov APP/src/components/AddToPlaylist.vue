<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePlaylistStore } from '../stores/playlists';

const playlistStore = usePlaylistStore();
const selectedPlaylist = ref('');
const trackUri = ref('');

onMounted(() => {
  playlistStore.fetchPlaylists();
});

const addTrack = () => {
  if (selectedPlaylist.value && trackUri.value.trim()) {
    playlistStore.addTrackToPlaylist(selectedPlaylist.value, trackUri.value);
    trackUri.value = ''; // Réinitialiser après ajout
  }
};
</script>

<template>
  <div class="add-to-playlist">
    <h2>🎶 Ajouter un morceau</h2>
    <select v-model="selectedPlaylist">
      <option value="" disabled>Sélectionner une playlist</option>
      <option v-for="playlist in playlistStore.playlists" :key="playlist.id" :value="playlist.id">
        {{ playlist.name }}
      </option>
    </select>
    <input v-model="trackUri" placeholder="Spotify URI (ex: spotify:track:xxxxx)" />
    <button @click="addTrack">➕ Ajouter</button>
  </div>
</template>

<style scoped>
.add-to-playlist {
  text-align: center;
}
select, input {
  padding: 10px;
  width: 80%;
  margin-top: 10px;
}
button {
  padding: 10px;
  background: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
