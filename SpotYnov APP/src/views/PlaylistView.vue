<template>
  <navbar/>
  <div class="playlist-view">
    <h1>Mes Playlists</h1>
    <AddToPlaylist />
  </div>
</template>

<script setup>
import AddToPlaylist from "../components/AddToPlaylist.vue";
import Navbar from "../components/Navbar.vue";
</script>

<style scoped>
.playlist-view {
  text-align: center;
  margin-top: 50px;
}
</style>
