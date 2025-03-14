import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
const apiUrl = import.meta.env.VITE_API_URL;

export const usePlaylistStore = defineStore('playlist', () => {
    const authStore = useAuthStore();
    const playlists = ref([]);
    const savedTracks = ref([]);

    // Récupérer les playlists de l'utilisateur
    const fetchPlaylists = async () => {
        try {
            const response = await fetch(`${apiUrl}/users/${authStore.username}/spotify/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            playlists.value = await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des playlists', error);
        }
    };

    // Récupérer les morceaux favoris de l'utilisateur
    const fetchSavedTracks = async () => {
        try {
            const response = await fetch(`${apiUrl}/users/${authStore.username}/spotify/saved_tracks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            savedTracks.value = await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération des morceaux favoris', error);
        }
    };

    // Créer une nouvelle playlist
    const createPlaylist = async (playlistName: string) => {
        try {
            await fetch(`${apiUrl}/users/${authStore.username}/spotify/playlists`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: playlistName }),
            });
            fetchPlaylists(); // Rafraîchir les playlists
        } catch (error) {
            console.error('Erreur lors de la création de la playlist', error);
        }
    };

    // Ajouter un morceau à une playlist
    const addTrackToPlaylist = async (playlistId: string, trackUri: string) => {
        try {
            await fetch(`${apiUrl}/users/${authStore.username}/spotify/playlists/${playlistId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uris: [trackUri] }),
            });
            fetchPlaylists();
        } catch (error) {
            console.error('Erreur lors de l’ajout du morceau à la playlist', error);
        }
    };

    return {
        playlists,
        savedTracks,
        fetchPlaylists,
        fetchSavedTracks,
        createPlaylist,
        addTrackToPlaylist,
    };
});
