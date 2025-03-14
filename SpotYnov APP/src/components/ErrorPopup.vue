<script setup lang="ts">
import {useNotificationStore} from "../stores/notification.ts";

const notificationStore = useNotificationStore();

</script>

<template>
<div class="notification-popup" v-if="useNotificationStore().notification">
    <p>{{notificationStore.notification}}</p>
    <button  @click="notificationStore.clearNotifications()" class="close-notification-btn">X</button>
</div>
</template>
<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.notification-popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: min-content;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  background-color: #212121;
  gap: 10px;
  animation: slide-up 0.5s ease-out;
}

.close-notification-btn {
  background: #383838;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: 1s !important;
}
</style>