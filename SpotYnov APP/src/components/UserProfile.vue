<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/users';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchSpotifyUserById("me");
});
</script>

<template>
  <div class="user-spotify-profil-ctn" v-if="userStore.userDetail && userStore.userPersonality">
    <div class="user-spotify-profil-line">
      <h1>Utilisateur spotify: </h1>
      <p>{{ userStore.userDetail.display_name }}</p>
    </div>
    <div class="user-spotify-profil-line">
      <h1>Followers: </h1>
      <p>{{ userStore.userDetail.follower_count }}</p>
    </div>
    <div class="user-spotify-profil-line">
      <h1>Titres ♥ : </h1>
      <p>{{ userStore.userPersonality.count }} aimés</p>
    </div>
    <div class="user-spotify-profil-line">
      <h1>Durée moyenne : </h1>
      <p>{{ userStore.userPersonality.avg_duration }} min</p>
    </div>
    <div class="user-spotify-profil-line">
      <h1>Titres ♥ : </h1>
      <p>{{ userStore.userPersonality.count }} aimés</p>
    </div>
    <div class="w-full">
      <h1>Popularity:  </h1>
      <div style="height: 20px; width: 100%; background: #1f1f1f; border-radius: 10px; margin-top: 5px;">
        <div :style="{borderRadius:`10px`, backgroundColor: `rgb(${255 - userStore.userPersonality.avg_popularity * 2.55}, ${userStore.userPersonality.avg_popularity * 2.55}, 0)`, height: '100%', width: userStore.userPersonality.avg_popularity + '%', display: 'flex', justifyContent: 'center', alignItems: 'center'}">
          <p>{{ userStore.userPersonality.avg_popularity }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-spotify-profil-ctn {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  min-width: fit-content;
  gap: 5px;
  padding: 10px;
  background: rgba(0, 0, 0, 0);
  color: white;
  border-left: 3px solid #1f1f1f;
  border-bottom: 3px solid #1f1f1f;
  border-bottom-left-radius: 10px;
}

h1 {
  font-weight: bold;
  color: #c9c9c9;
}
.user-spotify-profil-line {
  display: flex;
  flex-direction: row;
  gap: 15px;
  align-items: start;
  justify-content: space-between;
  width: 100%;
}
</style>