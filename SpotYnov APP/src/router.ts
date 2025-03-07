import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './store/auth';
import AuthForm from './components/AuthForm.vue';
import Dashboard from './views/Dashboard.vue';

const routes = [
    { path: '/', component: AuthForm },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

//@ts-ignore
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
