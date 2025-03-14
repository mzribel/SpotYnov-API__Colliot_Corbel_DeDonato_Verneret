<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import {useNotificationStore} from "../stores/notification.ts";
import ErrorPopup from "./ErrorPopup.vue";

const authStore = useAuthStore();
const notifStore = useNotificationStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const isLogin = ref(true);
const apiUrl = import.meta.env.VITE_API_URL;

const submitForm = async () => {
  const endpoint = isLogin.value ? '/auth/login' : '/auth/register';

  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: "Ex@mpl3P@ssw0rd"}), // TODO: replace with password.value
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.data);
      const token = data.data.access_token;
      if (token) {
        authStore.login(token, username.value);
        await router.push('/dashboard');
      }
    } else {
      throw await response.json();
    }
  } catch (error: any) {
    notifStore.addNotification(error.error.message);
  }
};
</script>

<template>
  <div class="auth-container">
    <ErrorPopup />
    <div class="auth-content">
      <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
      <form @submit.prevent="submitForm">
        <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />
        <button type="submit">{{ isLogin ? 'Se connecter' : "S'inscrire" }}</button>
      </form>
      <p @click="isLogin = !isLogin" class="toggle">
        {{ isLogin ? "Pas encore de compte ?" : "Déjà un compte ? Connectez-vous" }}
      </p>
    </div>
  </div>
</template>
<style scoped>
.auth-container {
  position: relative;
  margin: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../public/login_bg.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(5px);
  z-index: -1;
}

.auth-content {
  background: #191919;
  padding: 20px;
  border-radius: 10px;
  max-width: 300px;
  width: 100%;
  z-index: 1;
}

input, button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}

input {
  border-bottom: 1px solid #626262;
}

.toggle { cursor: pointer; color: #7f7fff; }
.error { color: red; }
</style>