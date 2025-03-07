import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('authToken') || '',
        username: localStorage.getItem('username') || '',
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
    },
    actions: {
        login(token: string, username: string) {
            this.token = token;
            this.username = username;
            localStorage.setItem('authToken', token);
            localStorage.setItem('username', username);
        },
        logout() {
            this.token = '';
            this.username = '';
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
        },
    },
});


