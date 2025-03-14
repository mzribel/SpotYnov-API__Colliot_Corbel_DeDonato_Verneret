<template>
  <navbar/>
  <div class="group-view flex flex-row">
    <side-bar/>
    <div class="flex w-full margin-10 flex-row dashboard">
      <h1>Mon groupe</h1>
      <GroupMembers />
      <GroupPlaylists />
    </div>
  </div>
</template>

<script setup>
import GroupMembers from "../components/GroupMembers.vue";
import GroupPlaylists from "../components/GroupPlaylists.vue";
import Navbar from "../components/Navbar.vue";
import SideBar from "../components/SideBar.vue";
</script>

<style scoped>
.group-view {
  text-align: center;
}
</style>
