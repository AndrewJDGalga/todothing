import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

const pinia = createPinia();

const app = createApp(App);
app.use(pinia); //plugin
app.mount('#app');
