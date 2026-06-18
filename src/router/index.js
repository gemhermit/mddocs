import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DocsLayout from '../views/docs/DocsLayout.vue'
import MarkdownDoc from '../views/docs/MarkdownDoc.vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase, getLocaleFromPath } from '../utils/site.js'

const docsChildren = [
  {
    path: '',
    name: 'docs-introduction',
    component: MarkdownDoc,
    meta: { titleKey: 'docs.introduction', docId: 'introduction', docPath: 'introduction' }
  },
  {
    path: 'getting-started/installation',
    name: 'docs-installation',
    component: MarkdownDoc,
    meta: { titleKey: 'docs.installation', docId: 'installation', docPath: 'getting-started/installation' }
  },
  {
    path: 'getting-started/usage',
    name: 'docs-usage',
    component: MarkdownDoc,
    meta: { titleKey: 'docs.usage', docId: 'usage', docPath: 'getting-started/usage' }
  }
]

const zhDocsChildren = [
  {
    path: '',
    name: 'docs-introduction-zh',
    component: MarkdownDoc,
    meta: { titleKey: 'docs.introduction', docId: 'introduction', docPath: 'introduction' }
  },
  {
    path: 'getting-started/installation',
    name: 'docs-installation-zh',
    component: MarkdownDoc,
    meta: { titleKey: 'docs.installation', docId: 'installation', docPath: 'getting-started/installation' }
  },
  {
    path: 'getting-started/usage',
    name: 'docs-usage-zh',
    component: MarkdownDoc,
    meta: { titleKey: 'docs.usage', docId: 'usage', docPath: 'getting-started/usage' }
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
