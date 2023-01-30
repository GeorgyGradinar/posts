import { createApp } from 'vue'
import App from './App.vue'
import store from "@/store/store";
import router from "@/router/routing"

createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
