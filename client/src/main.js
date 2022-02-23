import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue3-cookies';

const app = createApp(App);

app.use(VueCookies, {
  secure: false,
});

app.use(router).mount('#app');
