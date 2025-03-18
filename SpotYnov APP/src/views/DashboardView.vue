<template>
  <navbar />
  <div class="dashboard-view flex flex-row">
    <side-bar />
    <div class="flex w-full margin-10 flex-col dashboard">
      <CurrentGroup/>
      <div class="flex flex-row w-1/2">
        <GroupsList/>
        <UsersList/>
      </div>
    </div>
    <UserProfile/>
    <ErrorPopup />
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
import CurrentGroup from "../components/CurrentGroup.vue";
import ErrorPopup from "../components/ErrorPopup.vue";
</script>