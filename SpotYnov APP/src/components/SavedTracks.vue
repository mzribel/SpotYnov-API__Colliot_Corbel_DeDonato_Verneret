<script setup lang="ts">
import { onMounted } from 'vue';
import { usePlaylistStore } from '../stores/playlists';

const playlistStore = usePlaylistStore();

onMounted(() => {
  playlistStore.fetchSavedTracks();
});
</script>

<template>
  <div class="saved-tracks">
    <h2>❤️ Morceaux Favoris</h2>
    <ul>
      <li v-for="track in playlistStore.savedTracks" :key="track.id">
        {{ track.name }} - {{ track.artist }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.saved-tracks {
  text-align: center;
}
</style>
