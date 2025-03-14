<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePlaylistStore } from '../stores/playlists';

const playlistStore = usePlaylistStore();
const newPlaylistName = ref('');

onMounted(() => {
  playlistStore.fetchPlaylists();
});

const createPlaylist = () => {
  if (newPlaylistName.value.trim()) {
    playlistStore.createPlaylist(newPlaylistName.value);
    newPlaylistName.value = '';
  }
};
</script>

<template>
  <div class="playlists">
    <h2>📁 Mes Playlists</h2>
    <ul>
      <li v-for="playlist in playlistStore.playlists" :key="playlist.id">
        {{ playlist.name }}
      </li>
    </ul>
    <input v-model="newPlaylistName" placeholder="Nom de la playlist" />
    <button @click="createPlaylist">➕ Créer une Playlist</button>
  </div>
</template>

<style scoped>
.playlists {
  text-align: center;
}
input {
  padding: 10px;
  width: 80%;
  margin-top: 10px;
}
button {
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
