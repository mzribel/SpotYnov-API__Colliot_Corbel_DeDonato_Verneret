import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

const apiUrl = import.meta.env.VITE_API_URL;
export const useGroupStore = defineStore('group', () => {
    const authStore = useAuthStore();
    const groups = ref([]);
    const currentGroup = ref(null);
    const groupDetail = ref(null);

    // Récupérer tous les groupes
    const fetchGroups = async () => {
        try {
            const response = await fetch(`${apiUrl}/groups`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            const data = await response.json();
            groups.value = data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des groupes', error);
        }
    };

    // Ajouter un groupe
    const addGroup = async (groupname: string) => {
        try {
            await fetch(`${apiUrl}/groups`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupname }),
            });
            fetchGroups();
        } catch (error) {
            console.error('Erreur lors de la création du groupe', error);
        }
    };

    const updateCurrentGroup = async () => {
        try {
            const response = await fetch(`${apiUrl}/users/me/group`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                }
            })
            const data = await response.json();
            currentGroup.value = data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du groupe actuel', error);
        }

    }

    // Modifier un groupe
    const updateGroup = async (id: string, groupname: string) => {
        try {
            await fetch(`${apiUrl}/groups/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ groupname }),
            });
            fetchGroups();
        } catch (error) {
            console.error('Erreur lors de la mise à jour du groupe', error);
        }
    };

    // Supprimer un groupe
    const deleteGroup = async (id: string) => {
        try {
            await fetch(`${apiUrl}/groups/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            fetchGroups();
        } catch (error) {
            console.error('Erreur lors de la suppression du groupe', error);
        }
    };

    const joinGroup = async (id: string) => {
        try {
            await fetch(`${apiUrl}/groups/${id}/join`, {
                method: 'POST',
                headers: {

                }
            });
        } catch (error) {
            console.error('Erreur lors de la suppression du groupe', error);
        }
    }

    return {
        groups,
        currentGroup,
        groupDetail,
        fetchGroups,
        addGroup,
        updateGroup,
        updateCurrentGroup,
        deleteGroup,
        joinGroup,
    };
});
