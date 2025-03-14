<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupPlaylistStore } from '../stores/groupPlaylists';

const route = useRoute();
const groupId = route.params.id as string;
const groupPlaylistStore = useGroupPlaylistStore();
const newPlaylistName = ref('');

onMounted(() => {
  groupPlaylistStore.fetchGroupPlaylists(groupId);
});

const createPlaylist = () => {
  if (newPlaylistName.value.trim()) {
    groupPlaylistStore.createGroupPlaylist(groupId, newPlaylistName.value);
    newPlaylistName.value = '';
  }
};

const syncPlaylist = () => {
  groupPlaylistStore.syncGroupPlaylist(groupId);
};
</script>

<template>
  <div class="group-playlists">
    <h2>📁 Playlists du Groupe</h2>
    <ul>
      <li v-for="playlist in groupPlaylistStore.groupPlaylists" :key="playlist.id">
        {{ playlist.name }}
      </li>
    </ul>
    <input v-model="newPlaylistName" placeholder="Nom de la playlist" />
    <button @click="createPlaylist">➕ Créer une Playlist</button>
    <button @click="syncPlaylist">🔄 Synchroniser avec Spotify</button>
  </div>
</template>

<style scoped>
.group-playlists {
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
  margin: 5px;
}
</style>
