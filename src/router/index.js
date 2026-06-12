import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DocsLayout from '../views/docs/DocsLayout.vue'
import Introduction from '../views/docs/Introduction.vue'
import Installation from '../views/docs/Installation.vue'
import Usage from '../views/docs/Usage.vue'
import ZhIntroduction from '../views/docs/zh-cn/Introduction.vue'
import ZhInstallation from '../views/docs/zh-cn/Installation.vue'
import ZhUsage from '../views/docs/zh-cn/Usage.vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase, getLocaleFromPath } from '../utils/site.js'

const docsChildren = [
  {
    path: '',
    name: 'docs-introduction',
    component: Introduction,
    meta: { titleKey: 'docs.introduction', docId: 'introduction' }
  },
  {
    path: 'getting-started/installation',
    name: 'docs-installation',
    component: Installation,
    meta: { titleKey: 'docs.installation', docId: 'installation' }
  },
  {
    path: 'getting-started/usage',
    name: 'docs-usage',
    component: Usage,
    meta: { titleKey: 'docs.usage', docId: 'usage' }
  }
]

const zhDocsChildren = [
  {
    path: '',
    name: 'docs-introduction-zh',
    component: ZhIntroduction,
    meta: { titleKey: 'docs.introduction', docId: 'introduction' }
  },
  {
    path: 'getting-started/installation',
    name: 'docs-installation-zh',
    component: ZhInstallation,
    meta: { titleKey: 'docs.installation', docId: 'installation' }
  },
  {
    path: 'getting-started/usage',
    name: 'docs-usage-zh',
    component: ZhUsage,
    meta: { titleKey: 'docs.usage', docId: 'usage' }
  }
]

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/en/', redirect: '/' },
  { path: '/zh-cn/', name: 'home-zh', component: Home },
  { path: '/docs', redirect: '/docs/2/' },
  { path: '/zh-cn/docs', redirect: '/zh-cn/docs/2/' },
  { path: '/docs/2', component: DocsLayout, children: docsChildren },
  { path: '/zh-cn/docs/2', component: DocsLayout, children: zhDocsChildren },
  {
    path: '/:pathMatch(.*)*',
    redirect: (to) => {
      const locale = getLocaleFromPath(to.path)
      return getDocsBase(locale)
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const { syncLocaleWithPath } = useI18n()
  syncLocaleWithPath(to.path)
})

router.afterEach((to) => {
  const { t } = useI18n()
  const titleKey = to.meta?.titleKey
  const locale = getLocaleFromPath(to.path)
  const suffix = locale === 'zh-cn' ? 'mdui 文档' : 'mdui Docs'

  document.title = titleKey
    ? `${t(titleKey)} - ${suffix}`
    : 'mdui - Material Design 3 UI components using Web Components.'
})

export default router
