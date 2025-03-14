import { defineStore } from 'pinia';
import {computed, ref} from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const currentNotification = ref<string>('');

    const addNotification = (newNotification:string) => {
        currentNotification.value = newNotification;
        setTimeout(() => {
                clearNotification();
                }
            , 10000);
    };


    const clearNotification = () => {
        currentNotification.value = '';
    }

    return {
        notification: computed(() => currentNotification.value),
        addNotification,
        clearNotifications: clearNotification,
    };
});
