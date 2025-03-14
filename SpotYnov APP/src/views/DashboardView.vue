<template>
  <navbar />
  <div class="dashboard-view flex flex-row">
    <side-bar />
    <div class="flex w-full margin-10 flex-row dashboard">
      <GroupsList/>
      <UsersList/>
      <UserProfile/>
    </div>

  </div>
</template>

<style scoped>
.dashboard-view {
  text-align: center;
  align-items: start;

}
nav a {
  margin: 0 10px;
  text-decoration: none;
  color: white;
}
</style>
<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import GroupsList from "../components/GroupsList.vue";
import UsersList from "../components/UsersList.vue";
import SideBar from "../components/SideBar.vue";
import UserProfile from "../components/UserProfile.vue";
</script>