import { createRouter, createWebHistory } from 'vue-router'
import { docsPages } from '@/data/docs.js'
import { useI18n } from '@/i18n/index.js'
import { BASE_URL, stripBase, toAbsoluteUrl, stripLocalePrefix } from '@/utils/site.js'

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

// 锚点定位：等正文渲染完再滚到标题。
// 用 scrollIntoView 而不是手算偏移——浏览器会自动应用标题的 scroll-margin-top
// （src/App.vue 里统一设置），和页内点击原生锚点的落点完全一致，
// 两条路径不会互相抢着滚动、出现忽上忽下的跳动。
function scrollToHash(hash, done) {
  const id = decodeURIComponent(String(hash).replace(/^#/, ''))
  const startedAt = Date.now()

  const attempt = () => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      done(false)
      return
    }
    if (Date.now() - startedAt > 2000) {
      done(false)
      return
    }
    requestAnimationFrame(attempt)
  }

  attempt()
}

const router = createRouter({
  // 必须传 BASE_URL：vue-router 只认 <base> 标签，不吃 Vite 的 base，
  // 子路径部署（如 GitHub Pages 的 /mddocs/）不传就会整站 404
  history: createWebHistory(BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) {
      return new Promise((resolve) => scrollToHash(to.hash, resolve))
    }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  // 站内链接可能带部署前缀（子路径部署时），推给 router 前先剥掉
  const stripped = stripBase(to.path)
  if (stripped !== to.path) {
    return { path: stripped, query: to.query, hash: to.hash, replace: true }
  }

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
  // 注意：HTML 里属性值的选择器匹配不区分大小写，hreflang="zh-cn" 会被
  // [hreflang="zh-CN"] 命中，所以这里要显式回写属性，统一成 zh-CN。
  let el = document.head.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    document.head.appendChild(el)
  }
  el.setAttribute('hreflang', hreflang)
  el.setAttribute('href', href)
}

router.afterEach((to) => {
  const { t } = useI18n()
  const titleKey = to.meta?.titleKey
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
  setAlternate('zh-CN', toAbsoluteUrl(`/zh-cn${alternateBase}`))
  setAlternate('x-default', toAbsoluteUrl(alternateBase))
})

export default router
