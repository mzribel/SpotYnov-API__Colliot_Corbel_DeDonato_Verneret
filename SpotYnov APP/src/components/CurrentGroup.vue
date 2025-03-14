<script setup lang="ts">
import { onMounted } from 'vue';
import { useGroupStore } from '../stores/groups';

const groupStore = useGroupStore();

onMounted(() => {
  groupStore.fetchGroups();
});

</script>

<template>
  <div class="groups-list gap-10">
    <h1>Liste des groupes</h1>
    <div class="flex justify-between gap-20">
    </div>
  </div>
</template>

<style scoped>
.groups-list {
  max-width: 500px;
  text-align: center;
  margin: 10px;
  padding: 20px;
  background: #191919;
  border-radius: 10px;
}

li{
  padding: 10px;
  border-top: 1px solid #474747;
}

.group-line {
  justify-content: space-between;
  gap: 20px;
}



h1 {
  color: white;
  font-size: 1.2rem;
}

h3 {
  font-size: 1rem;
}
</style>
