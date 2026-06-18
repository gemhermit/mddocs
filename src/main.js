import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'mdui/mdui.css'
import 'mdui'
import './styles/main.css'
import { vHighlight } from './utils/highlight.js'

const app = createApp(App)
app.use(router)
app.directive('highlight', vHighlight)
app.mount('#app')
