import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';
const apiUrl = import.meta.env.VITE_API_URL;

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore();
    const users = ref([]);
    const userDetail = ref(null);

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

    const fetchSpotifyUserById = async (id: string) => {
        try {
            const response = await fetch(`${apiUrl}/users/${id}/spotify/profile`, {
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


    // Ajouter un utilisateur
    const addUser = async (username: string, password: string) => {
        try {
            await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            fetchUsers(); // Rafraîchir la liste
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur', error);
        }
    };

    // Modifier un utilisateur
    const updateUser = async (id: string, username: string, password: string) => {
        try {
            await fetch(`${apiUrl}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
        }
    };

    // Supprimer un utilisateur
    const deleteUser = async (id: string) => {
        try {
            await fetch(`${apiUrl}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            await fetchUsers();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur', error);
        }
    };

    return {
        users,
        userDetail,
        fetchUsers,
        fetchUserById,
        fetchSpotifyUserById,
        addUser,
        updateUser,
        deleteUser,
    };
});
