<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import {ref} from "vue";
import AccountLinker from "./AccountLinker.vue";

const authStore = useAuthStore();
const router = useRouter();

const accountLinkerVisible = ref(false);

const logout = () => {
  authStore.logout();
  router.push('/');
};

</script>

<template>
  <nav class="navbar ">
    <div class="hover:cursor-pointer flex items-center gap-3" @click="router.push('/dashboard')">
      <img src="../../public/lettre-y.png" class="h-10 w-10" alt="logo">
      SpotYnov
    </div>
    <div class="nav-links" v-if="authStore.isAuthenticated">
      <span>Bienvenue, {{ authStore.username }}</span>
      <button class="to-spotify-btn flex flex-row gap-3" @click="()=>{accountLinkerVisible = !accountLinkerVisible}" >
        <img src="../../public/spotlogo.png" class="h-6 w-6" alt="spotify logo">
        Connexion Spotify
      </button>
      <button class="logout" @click="logout">Déconnexion</button>
    </div>
    <AccountLinker @update:accountLinkerVisible="accountLinkerVisible = $event"
        v-if="accountLinkerVisible" />
  </nav>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #000000;
  color: white;
  border-bottom: 3px solid #1f1f1f;
}
.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
}
button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background: #1f1f1f;
  color: #9d9d9d;
  border-radius: 5px;
  transition: 1s !important;
}
button:hover {
  background: #656565;
  color: white;
}

.logout{
  background: linear-gradient(0deg, #1f1f1f, #540000);
}

.logout:hover{
  background: red;
  transition: 1s;

}

.to-spotify-btn{
  background: linear-gradient(180deg, #004600, #1f1f1f);
}

.to-spotify-btn:hover{
  background: #1DB954;
  transition: 1s;
}

</style>