import { RouteRecordRaw } from 'vue-router';
import Home from '../components/Home.vue';
import Registration from '../components/Registration.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/register',
        name: 'Registration',
        component: Registration
    }
    //TODO -- additional routes
];

export default routes;