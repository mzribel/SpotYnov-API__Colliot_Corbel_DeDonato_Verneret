import { createRouter, createWebHistory } from 'vue-router';
import AuthView from "./views/AuthView.vue";
import DashboardView from "./views/DashboardView.vue";
import PlaylistView from "./views/PlaylistView.vue";
import GroupView from "./views/GroupView.vue";
import {useAuthStore} from "./store/auth.ts";


const routes = [
    {
        path: '/',
        redirect: '/auth',
    },
    {
        path: '/auth',
        name: 'Auth',
        component: AuthView,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true },
    },
    {
        path: '/playlists',
        name: 'Playlists',
        component: PlaylistView,
        meta: { requiresAuth: true },
    },
    {
        path: '/groups',
        name: 'Groups',
        component: GroupView,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guard pour vérifier l'authentification
router.beforeEach((to, from, next) => {

    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        console.log("noauth")
        next('/auth');
    } else {
        next();
    }
});

export default router;
