import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@oruga-ui/theme-bootstrap/dist/bootstrap.css';
import 'bootstrap';

const app = createApp(App)

app.use(router)

app.mount('#app')
