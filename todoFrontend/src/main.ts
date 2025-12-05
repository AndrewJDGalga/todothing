import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './router/routes';

const pinia = createPinia();
const router = createRouter({
    history: createWebHistory(),
    routes,
});

const app = createApp(App);
app.use(pinia); //plugin
app.use(router);
app.mount('#app');
