import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { docsPages } from '../src/data/docs.js'
import { translate } from '../src/i18n/messages.js'
import { SITE_URL, getLocalePrefix, stripLocalePrefix } from '../src/utils/site.js'
import { escapeHtml, escapeRegExp } from '../src/utils/text.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const GENERATED_DIR = join(ROOT, 'src/content/generated/pages')
const BASE_URL = (process.env.SITE_URL || SITE_URL).replace(/\/+$/, '')

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('[prerender] dist/index.html not found. Run `vite build` first.')
  process.exit(1)
}

if (!existsSync(GENERATED_DIR)) {
  console.error('[prerender] 缺少 src/content/generated/，请先运行 `node scripts/build-content.mjs`。')
  process.exit(1)
}

const templateHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')

// 正文 HTML 在构建期已渲染并消毒（scripts/build-content.mjs），这里直接复用，
// 保证「预渲染产物」与「客户端拿到的内容」是同一份，不会出现两份不一致的输出。
const htmlCache = new Map()

async function readGeneratedHtml(locale, pagePath) {
  const file = join(GENERATED_DIR, locale, `${pagePath || 'introduction'}.js`)
  if (!existsSync(file)) return ''

  const key = file
  if (!htmlCache.has(key)) {
    const module = await import(pathToFileURL(file).href)
    htmlCache.set(key, module.html || '')
  }
  return htmlCache.get(key)
}

function upsertMeta(html, attr, val, content) {
  const selector = escapeRegExp(`${attr}="${val}"`)
  const regex = new RegExp(`<meta\\s+[^>]*${selector}[^>]*>`, 'i')
  const newTag = `<meta ${attr}="${val}" content="${escapeHtml(content)}">`
  if (regex.test(html)) {
    return html.replace(regex, newTag)
  }
  return html.replace('</head>', `  ${newTag}\n</head>`)
}

function upsertLink(html, rel, href) {
  const regex = new RegExp(`<link\\s+[^>]*rel=["']${escapeRegExp(rel)}["'][^>]*>`, 'i')
  const newTag = `<link rel="${rel}" href="${escapeHtml(href)}">`
  if (regex.test(html)) {
    return html.replace(regex, newTag)
  }
  return html.replace('</head>', `  ${newTag}\n</head>`)
}

function upsertAlternate(html, hreflang, href) {
  const regex = new RegExp(`<link\\s+[^>]*rel=["']alternate["'][^>]*hreflang=["']${escapeRegExp(hreflang)}["'][^>]*>`, 'i')
  const newTag = `<link rel="alternate" hreflang="${hreflang}" href="${escapeHtml(href)}">`
  if (regex.test(html)) {
    return html.replace(regex, newTag)
  }
  return html.replace('</head>', `  ${newTag}\n</head>`)
}

function renderPageHtml({ route, locale, page, bodyHtml = '' }) {
  let html = templateHtml

  // <html lang>
  html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale === 'zh-cn' ? 'zh-CN' : 'en'}"`)

  // title
  const suffix = translate(locale, 'app.tagline')
  const pageTitle = page ? translate(locale, page.titleKey) : ''
  const title = page ? `${pageTitle} - ${suffix}` : suffix
  html = html.replace(/<title>.*<\/title>/, `<title>${escapeHtml(title)}</title>`)

  // description & canonical
  const description = page
    ? translate(locale, 'meta.docDescription').replace('{title}', pageTitle)
    : translate(locale, 'meta.homeDescription')
  const canonicalUrl = `${BASE_URL}${route}`

  html = upsertMeta(html, 'name', 'description', description)
  html = upsertMeta(html, 'property', 'og:title', title)
  html = upsertMeta(html, 'property', 'og:description', description)
  html = upsertMeta(html, 'property', 'og:url', canonicalUrl)
  html = upsertMeta(html, 'property', 'og:type', page ? 'article' : 'website')
  html = upsertMeta(html, 'name', 'twitter:card', 'summary')
  html = upsertMeta(html, 'name', 'twitter:title', title)
  html = upsertMeta(html, 'name', 'twitter:description', description)
  html = upsertLink(html, 'canonical', canonicalUrl)

  // hreflang 按页面更新，避免模板里的静态 alternate 全部指向首页
  const alternateBase = stripLocalePrefix(route)
  html = upsertAlternate(html, 'en', `${BASE_URL}${alternateBase}`)
  html = upsertAlternate(html, 'zh-CN', `${BASE_URL}/zh-cn${alternateBase}`)
  html = upsertAlternate(html, 'x-default', `${BASE_URL}${alternateBase}`)

  // #app 注入渲染的 markdown 正文（爬虫可读，client hydrate 时替换）
  let appContent = ''
  if (page && bodyHtml) {
    appContent = `<main class="container mdui-prose prerender-shell"><div class="markdown-body">${bodyHtml}</div></main>`
  }
  html = html.replace(/<div\s+id="app">\s*<\/div>/, `<div id="app">${appContent}</div>`)

  return html
}

async function main() {
  const locales = ['en', 'zh-cn']
  const routes = []
  for (const locale of locales) {
    const prefix = getLocalePrefix(locale)
    routes.push({ route: `${prefix}/`, locale, page: null })
    for (const page of docsPages) {
      const path = page.path ? `${prefix}/docs/${page.path}` : `${prefix}/docs`
      routes.push({ route: path, locale, page })
    }
  }

  let ok = 0
  let fail = 0
  for (const item of routes) {
    try {
      const bodyHtml = item.page ? await readGeneratedHtml(item.locale, item.page.path) : ''
      const html = renderPageHtml({ ...item, bodyHtml })
      const clean = item.route.replace(/^\/+/, '').replace(/\/+$/, '')
      const filePath = clean ? join(DIST, clean, 'index.html') : join(DIST, 'index.html')
      mkdirSync(dirname(filePath), { recursive: true })
      writeFileSync(filePath, html, 'utf-8')
      ok++
      console.log(`[prerender] ok   ${item.route}`)
    } catch (err) {
      fail++
      console.error(`[prerender] FAIL ${item.route}: ${err.message}`)
    }
  }

  // 404.html：GitHub Pages 等静态托管在路径不存在时会回退到这个文件，
  // 由前端路由接管并渲染 404 页面（同时带 noindex，避免软 404 被收录）。
  const notFoundHtml = upsertMeta(templateHtml, 'name', 'robots', 'noindex, follow')
  writeFileSync(join(DIST, '404.html'), notFoundHtml, 'utf-8')
  console.log('[prerender] ok   /404.html')

  console.log(`[prerender] done: ${ok} ok, ${fail} fail`)
  if (fail > 0) process.exitCode = 1
}

main()
