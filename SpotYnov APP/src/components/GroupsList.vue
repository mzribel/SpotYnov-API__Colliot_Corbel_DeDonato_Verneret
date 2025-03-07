<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useGroupStore } from '../store/groups';

const groupStore = useGroupStore();
const newGroupName = ref('');

onMounted(() => {
  groupStore.fetchGroups();
});

</script>

<template>
  <div class="groups-list gap-10">
    <h1>Liste des groupes</h1>
    <div class="flex justify-between gap-20">
<!--      <h3>Nom</h3> |-->
<!--      <h3>Nombre d'utilisateur</h3>-->
    </div>
    <ul class="pt-10">
      <li v-for="group in groupStore.groups" :key="group.id" class="flex flex-row justify-between">
        {{ group.name }}
        {{ group.members.length }}
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
  border-radius: 10px;
}

li{
  padding: 10px;
  border-top: 1px solid #474747;
}


button {
  background: red;
  color: white;
  padding: 5px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
}

h1 {
  color: white;
  font-size: 1.2rem;
}

h3 {
  font-size: 1rem;
}
</style>
