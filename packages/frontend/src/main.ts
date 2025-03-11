import { createApp } from 'vue';
import './style.css'
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import router from './router';

const app = createApp(App)

app.use(PrimeVue);
app.use(ToastService);
app.use(router);
app.mount('#app');
