import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useGroupStore = defineStore('group', () => {
    const authStore = useAuthStore();
    const groups = ref([]);
    const groupDetail = ref(null);

    // Récupérer tous les groupes
    const fetchGroups = async () => {
        try {
            const response = await fetch('http://localhost:3000/groups', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                },
            });
            const data = await response.json();
            // console.log(data.data)
            groups.value = data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des groupes', error);
        }
    };

    // Ajouter un groupe
    const addGroup = async (groupname: string) => {
        try {
            await fetch('http://localhost:3000/groups', {
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

    // Modifier un groupe
    const updateGroup = async (id: string, groupname: string) => {
        try {
            await fetch(`http://localhost:3000/groups/${id}`, {
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
            await fetch(`http://localhost:3000/groups/${id}`, {
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

    return {
        groups,
        groupDetail,
        fetchGroups,
        addGroup,
        updateGroup,
        deleteGroup,
    };
});
