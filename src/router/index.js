import { createRouter, createWebHistory } from 'vue-router'
import { docsPages } from '@/data/docs.js'
import { useI18n } from '@/i18n/index.js'
import { getLocaleFromPath, toAbsoluteUrl, stripLocalePrefix } from '@/utils/site.js'

// 视图懒加载：按路由拆分 chunk，减小首屏 JS 体积
const Home = () => import('@/views/Home.vue')
const DocsLayout = () => import('@/views/docs/DocsLayout.vue')
const MarkdownDoc = () => import('@/views/docs/MarkdownDoc.vue')
const NotFound = () => import('@/views/NotFound.vue')

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
  { path: '/docs', component: DocsLayout, children: docsChildren },
  { path: '/zh-cn/docs', component: DocsLayout, children: zhDocsChildren },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
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

function setMeta(attr, val, content) {
  let el = document.head.querySelector(`meta[${attr}="${val}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, val)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkRel(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setAlternate(hreflang, href) {
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

router.afterEach((to) => {
  const { t } = useI18n()
  const titleKey = to.meta?.titleKey
  const locale = getLocaleFromPath(to.path)
  const suffix = t('app.tagline')

  const pageTitle = titleKey ? t(titleKey) : ''
  document.title = titleKey ? `${pageTitle} - ${suffix}` : suffix

  const description = titleKey
    ? t('meta.docDescription').replace('{title}', pageTitle)
    : t('meta.homeDescription')
  const canonicalUrl = toAbsoluteUrl(to.path)

  setMeta('name', 'description', description)
  setMeta('property', 'og:title', document.title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:url', canonicalUrl)
  setMeta('property', 'og:type', titleKey ? 'article' : 'website')
  setMeta('name', 'twitter:card', 'summary')
  setMeta('name', 'twitter:title', document.title)
  setMeta('name', 'twitter:description', description)
  setLinkRel('canonical', canonicalUrl)

  // hreflang 跟随当前页面更新，与预渲染产物保持一致
  const alternateBase = stripLocalePrefix(to.path)
  setAlternate('en', toAbsoluteUrl(alternateBase))
  setAlternate('zh-cn', toAbsoluteUrl(`/zh-cn${alternateBase}`))
  setAlternate('x-default', toAbsoluteUrl(alternateBase))
})

export default router
