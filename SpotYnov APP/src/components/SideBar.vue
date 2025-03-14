<script setup lang="ts">

import router from "../router.ts";
</script>

<template>
  <nav class="sidebar ">

    <div class="nav-links">
      <button class="home-btn flex flex-row gap-3" @click="router.push('/dashboard')">
        <img src="../../public/home-agreement.png" class="h-10 w-10" alt="home">
      </button>
      <button class="home-btn flex flex-row gap-3" @click="router.push('/group')">
        <img src="../../public/dance.png" class="h-10 w-10" alt="group">
      </button>
    </div>

  </nav>
</template>

<style scoped>
.sidebar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #000000;
  color: white;
  border-right: 3px solid #1f1f1f;
}

.nav-links{
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background: #1f1f1f;
  color: #9d9d9d;
  border-radius: 10px;
  transition: 1s !important;
}
button:hover {
  background: #2f2f2f;
  color: white;
}

.home-btn{
  background: #1f1f1f;
}
</style>