import { defineStore } from 'pinia';
import {computed, ref} from 'vue';
import { useAuthStore } from './auth';
const apiUrl = import.meta.env.VITE_API_URL;

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore();
    const users = ref([]);
    const userDetail = ref("");
    const userPersonality = ref("");

    // Récupérer tous les utilisateurs
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            const data = await response.json();
            users.value = data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs', error);
        }
    };

    // Récupérer un utilisateur par ID
    const fetchUserById = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            userDetail.value = await response.json();
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur', error);
        }
    };


    // Récupérer un utilisateur Spotify par ID
    const fetchSpotifyUserById = async (id: string) => {
        await fetchSpotifyProfile(id);
        await fetchSpotifyUserPersonalityBySavedTracks(id);
    }

    // Récupérer le profil Spotify d'un utilisateur
    const fetchSpotifyProfile = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/users/${id}/spotify/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            const data = await response.json();
            userDetail.value = data.data;
            console.log(userDetail.value);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur', error);
        }
    };


    // Récupérer la personnalité d'un utilisateur Spotify par ses morceaux sauvegardés
    const fetchSpotifyUserPersonalityBySavedTracks = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/users/${id}/spotify/saved_tracks/personality`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            const data = await response.json();
            userPersonality.value = data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur', error);
        }
    };


    return {
        users,
        userDetail: computed(() => userDetail.value),
        userPersonality: computed(() => userPersonality.value),
        fetchUsers,
        fetchUserById,
        fetchSpotifyUserById,
    };
});
