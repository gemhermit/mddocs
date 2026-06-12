import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'mdui/mdui.css'
import 'mdui'
import './styles/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
