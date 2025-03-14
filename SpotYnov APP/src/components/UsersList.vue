<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/users';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUsers();
});

const deleteUser = (id: string) => {
  if (confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
    userStore.deleteUser(id);
  }
};
</script>

<template>
  <div class="users-list">
    <h1>Liste des utilisateurs</h1>
    <ul>
      <li v-for="user in userStore.users" :key="user.id">
        {{ user.username }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.users-list {
  max-width: 500px;
  text-align: center;
  margin: 10px;
  padding: 20px;
  background: #191919;
  border-radius: 10px;
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
</style>
