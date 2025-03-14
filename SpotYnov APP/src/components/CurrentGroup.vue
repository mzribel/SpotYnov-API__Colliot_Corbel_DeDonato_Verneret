<script setup lang="ts">
import { onMounted } from 'vue';
import { useGroupStore } from '../stores/groups';

const groupStore = useGroupStore();

onMounted(() => {
  groupStore.updateCurrentGroup();
});

</script>

<template>
  <div class="current-group-ctn flex flex-row gap-10 cursor-pointer" @click="()=>$router.push('/group')">
    Groupe actuel :
    <div class="flex justify-between gap-20" v-if="groupStore.currentGroup">
      <h1>{{ groupStore.currentGroup.name }}</h1>
      <h3>{{ groupStore.currentGroup.member_count }} membre</h3>
    </div>
    <div v-else>
      <p>Vous n'êtes dans aucun groupe.</p>
    </div>
  </div>
</template>

<style scoped>
.current-group-ctn {
  max-width: 500px;
  text-align: center;
  margin: 10px;
  padding: 20px;
  background: #191919;
  border-radius: 10px;
}
.current-group-ctn:hover {
  transition: 1s;
  background: #474747;
}

li{
  padding: 10px;
  border-top: 1px solid #474747;
}
h1 {
  color: white;
  font-size: 1.2rem;
}

h3 {
  font-size: 1rem;
}
</style>
