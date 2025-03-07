<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const groupId = route.params.id;
const members = ref([]);
const newMemberId = ref('');

const fetchMembers = async () => {
  try {
    const response = await fetch(`http://localhost:3000/groups/${groupId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    });
    const data = await response.json();
    members.value = data.members;
  } catch (error) {
    console.error('Erreur lors de la récupération des membres', error);
  }
};

const addMember = async () => {
  if (!newMemberId.value.trim()) return;

  try {
    await fetch(`http://localhost:3000/groups/${groupId}/members`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: newMemberId.value }),
    });
    newMemberId.value = '';
    fetchMembers();
  } catch (error) {
    console.error('Erreur lors de l’ajout du membre', error);
  }
};

const promoteMember = async (memberId: string) => {
  try {
    await fetch(`http://localhost:3000/groups/${groupId}/members/${memberId}/promote`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    });
    fetchMembers();
  } catch (error) {
    console.error('Erreur lors de la promotion du membre', error);
  }
};

onMounted(() => {
  fetchMembers();
});
</script>

<template>
  <div class="group-members">
    <h2>Membres du groupe</h2>
    <ul>
      <li v-for="member in members" :key="member.id">
        {{ member.username }}
        <button @click="promoteMember(member.id)">⭐ Promouvoir</button>
      </li>
    </ul>
    <input v-model="newMemberId" placeholder="ID du membre" />
    <button @click="addMember">➕ Ajouter un membre</button>
  </div>
</template>

<style scoped>
.group-members {
  max-width: 500px;
  margin: auto;
  text-align: center;
}
button {
  background: blue;
  color: white;
  padding: 5px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
}
</style>
