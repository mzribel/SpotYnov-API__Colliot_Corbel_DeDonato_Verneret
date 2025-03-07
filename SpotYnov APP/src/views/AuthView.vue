<template>
    <AuthForm />
</template>

<script setup>
import AuthForm from "../components/AuthForm.vue";
import { useRouter } from 'vue-router';

const router = useRouter();


</script>

<style scoped>
.auth-view {
  text-align: center;
  margin-top: 50px;
}
</style>
