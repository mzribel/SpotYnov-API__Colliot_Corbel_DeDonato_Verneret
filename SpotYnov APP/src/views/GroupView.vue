<template>
  <navbar/>
  <div class="group-view">
    <h1>Groupes</h1>
    <GroupMembers />
    <GroupPlaylists />
  </div>
</template>

<script setup>
import GroupMembers from "../components/GroupMembers.vue";
import GroupPlaylists from "../components/GroupPlaylists.vue";
import Navbar from "../components/Navbar.vue";
</script>

<style scoped>
.group-view {
  text-align: center;
  margin-top: 50px;
}
</style>
