<template>
  <navbar />
  <div class="dashboard-view">

    <div class="flex w-full margin-10 justify-center items-center flex-row dashboard">
      <GroupsList/>
      <UsersList/>
    </div>

  </div>
</template>

<style scoped>
.dashboard-view {
  text-align: center;
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
</script>