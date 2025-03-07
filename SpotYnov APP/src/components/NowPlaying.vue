<script setup lang="ts">
import { onMounted } from 'vue';
import { useSpotifyStore } from '../store/spotify';

const spotifyStore = useSpotifyStore();

onMounted(() => {
  spotifyStore.fetchCurrentlyPlaying();
});
</script>

<template>
  <div class="now-playing" v-if="spotifyStore.currentlyPlaying">
    <h2>🎶 Actuellement en lecture</h2>
    <p><strong>{{ spotifyStore.currentlyPlaying.name }}</strong> - {{ spotifyStore.currentlyPlaying.artist }}</p>
    <img :src="spotifyStore.currentlyPlaying.album_cover" alt="Cover" />
  </div>
</template>

<style scoped>
.now-playing {
  text-align: center;
  margin-top: 20px;
}
img {
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
</style>
