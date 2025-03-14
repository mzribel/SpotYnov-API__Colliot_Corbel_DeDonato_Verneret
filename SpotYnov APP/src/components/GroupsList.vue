<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGroupStore } from '../stores/groups';

const groupStore = useGroupStore();

onMounted(() => {
  groupStore.fetchGroups();
});

</script>

<template>
  <div class="groups-list">
    <h1>Liste des groupes</h1>
    <ul class="pt-10">
      <li v-for="group in groupStore.groups" :key="group.id" class="group-line flex flex-row justify-between">
        <p class="min-w-10">{{ group.name }}</p>
        <div class="flex flex-row gap-3">
          <p class="flex items-center">{{ group.member_count }} membres</p>
          <button @click="groupStore.joinGroup(group.id)">Rejoindre</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.groups-list {
  max-width: 500px;
  text-align: center;
  margin: 10px;
  padding: 20px;
  background: #191919;
  border-radius: 20px;
  gap: 10px !important;
}

li{
  padding: 10px;
  border-bottom: 1px solid #474747;
}

.group-line {
  justify-content: space-between;
  gap: 10px;
  display: flex;
  align-items: center;
}

h1 {
  color: white;
  font-size: 1.2rem;
}
</style>
