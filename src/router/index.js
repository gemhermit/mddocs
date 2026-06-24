import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DocsLayout from '../views/docs/DocsLayout.vue'
import MarkdownDoc from '../views/docs/MarkdownDoc.vue'
import { docsPages } from '../data/docs.js'
import { useI18n } from '../i18n/index.js'
import { getDocsBase, getLocaleFromPath } from '../utils/site.js'

function createDocsChildren(locale = 'en') {
  return docsPages.map((page) => ({
    path: page.path,
    name: locale === 'zh-cn' ? `docs-${page.id}-zh` : `docs-${page.id}`,
    component: MarkdownDoc,
    meta: {
      titleKey: page.titleKey,
      docId: page.id,
      docPath: page.path || 'introduction'
    }
  }))
}

const docsChildren = createDocsChildren()
const zhDocsChildren = createDocsChildren('zh-cn')

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/en/', redirect: '/' },
  { path: '/zh-cn/', name: 'home-zh', component: Home },
  { path: '/docs', redirect: '/docs/' },
  { path: '/zh-cn/docs', redirect: '/zh-cn/docs/' },
  { path: '/docs', component: DocsLayout, children: docsChildren },
  { path: '/zh-cn/docs', component: DocsLayout, children: zhDocsChildren },
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
  const suffix = locale === 'zh-cn' ? '基于 mdui 2 的开源文档系统' : 'Open-source docs system built on mdui 2'

  document.title = titleKey
    ? `${t(titleKey)} - ${suffix}`
    : suffix
})

export default router
