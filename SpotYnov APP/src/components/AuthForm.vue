<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const isLogin = ref(true);
const errorMessage = ref('');

const submitForm = async () => {
  errorMessage.value = '';
  const endpoint = isLogin.value ? '/auth/login' : '/auth/register';

  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: "Ex@mpl3P@ssw0rd"}),
    });

    if (!response.ok) throw new Error('Échec de la requête');

    const data = await response.json();
    const token = data.data.access_token
    if (isLogin.value && token) {
      authStore.login(token, username.value);
      await router.push('/dashboard');
    }
  } catch (error) {
    errorMessage.value = isLogin.value ? "Erreur :  identifiants invalides" : "Erreur : l'utilisateur existe deja";
  }
};
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
    <form @submit.prevent="submitForm">
      <input type="text" v-model="username" placeholder="Nom d'utilisateur" required />
      <input type="password" v-model="password" placeholder="Mot de passe" required />
      <button type="submit">{{ isLogin ? 'Se connecter' : "S'inscrire" }}</button>
    </form>
    <p @click="isLogin = !isLogin" class="toggle">
      {{ isLogin ? "Pas encore de compte ?" : "Déjà un compte ? Connectez-vous" }}
    </p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 300px;
  margin: auto;
  text-align: center;
}
input, button {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 10px;
}
.toggle { cursor: pointer; color: blue; }
.error { color: red; }
</style>
