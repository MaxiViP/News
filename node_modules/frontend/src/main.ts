import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { reveal } from './directives/reveal'

const app = createApp(App)
app.directive('reveal', reveal)
app.use(createPinia()).use(router).mount('#app')
