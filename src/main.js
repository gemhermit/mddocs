import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import 'mdui/mdui.css'
import '@/styles/icons.css'
// 按需引入实际用到的 mdui 组件，避免全量打包
import 'mdui/components/button.js'
import 'mdui/components/button-icon.js'
import 'mdui/components/card.js'
import 'mdui/components/circular-progress.js'
import 'mdui/components/collapse.js'
import 'mdui/components/collapse-item.js'
import 'mdui/components/divider.js'
import 'mdui/components/dropdown.js'
import 'mdui/components/icon.js'
import 'mdui/components/layout.js'
import 'mdui/components/layout-main.js'
import 'mdui/components/list.js'
import 'mdui/components/list-item.js'
import 'mdui/components/menu.js'
import 'mdui/components/menu-item.js'
import 'mdui/components/navigation-drawer.js'
import 'mdui/components/tooltip.js'
import 'mdui/components/top-app-bar.js'
import 'mdui/components/top-app-bar-title.js'
import '@/styles/main.css'
import { vHighlight } from '@/utils/highlight.js'
import { installLinkInterceptor } from '@/utils/navigation.js'

const app = createApp(App)
app.use(router)
app.directive('highlight', vHighlight)
// 站内 href 链接（Sidebar / 上下篇 / 搜索结果 / 正文内链）统一走 router.push
installLinkInterceptor(router)
app.mount('#app')
