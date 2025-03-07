import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useSpotifyStore = defineStore('spotify', () => {
    const authStore = useAuthStore();
    const currentlyPlaying = ref(null);

    // Récupérer la musique en cours de lecture
    const fetchCurrentlyPlaying = async () => {
        try {
            const response = await fetch(`http://localhost:3000/users/${authStore.username}/spotify/currently_playing`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });

            if (!response.ok) throw new Error('Erreur lors de la récupération du morceau en cours');

            currentlyPlaying.value = await response.json();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Lire une musique spécifique
    const playTrack = async (trackUri: string, position: number = 0) => {
        try {
            await fetch(`http://localhost:3000/users/${authStore.username}/spotify/play`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uris: [trackUri], progress_ms: position }),
            });
            fetchCurrentlyPlaying(); // Mettre à jour la musique en cours
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return {
        currentlyPlaying,
        fetchCurrentlyPlaying,
        playTrack,
    };
});
