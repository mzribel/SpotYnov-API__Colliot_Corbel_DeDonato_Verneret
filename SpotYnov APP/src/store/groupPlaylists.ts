import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useGroupPlaylistStore = defineStore('groupPlaylist', () => {
  const authStore = useAuthStore();
  const groupPlaylists = ref([]);

  // Récupérer les playlists d'un groupe
  const fetchGroupPlaylists = async (groupId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/groups/${groupId}/spotify/playlists`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération des playlists de groupe');

      groupPlaylists.value = await response.json();
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Créer une playlist pour un groupe
  const createGroupPlaylist = async (groupId: string, playlistName: string) => {
    try {
      await fetch(`http://localhost:3000/groups/${groupId}/spotify/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playlistName }),
      });
      fetchGroupPlaylists(groupId);
    } catch (error) {
      console.error('Erreur lors de la création de la playlist de groupe', error);
    }
  };

  // Synchroniser une playlist avec Spotify
  const syncGroupPlaylist = async (groupId: string) => {
    try {
      await fetch(`http://localhost:3000/groups/${groupId}/spotify/synchronize`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
        },
      });
      alert('Playlist synchronisée avec succès !');
    } catch (error) {
      console.error('Erreur lors de la synchronisation de la playlist de groupe', error);
    }
  };

  return {
    groupPlaylists,
    fetchGroupPlaylists,
    createGroupPlaylist,
    syncGroupPlaylist,
  };
});
