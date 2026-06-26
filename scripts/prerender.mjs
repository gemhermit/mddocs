import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docsPages } from '../src/data/docs.js'
import { messages } from '../src/i18n/messages.js'
import { SITE_URL, getLocalePrefix } from '../src/utils/site.js'
import { renderMarkdown } from '../src/utils/markdown.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const BASE_URL = (process.env.SITE_URL || SITE_URL).replace(/\/+$/, '')

if (!existsSync(join(DIST, 'index.html'))) {
  console.error('[prerender] dist/index.html not found. Run `vite build` first.')
  process.exit(1)
}

const templateHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')

function readMd(locale, pagePath) {
  const file = pagePath ? `${pagePath}.md` : 'introduction.md'
  const filePath = join(ROOT, 'src/content/docs', locale, file)
  if (!existsSync(filePath)) return ''
  return readFileSync(filePath, 'utf-8')
}

function translate(locale, key) {
  const keys = key.split('.')
  let val = messages[locale]
  for (const k of keys) val = val?.[k]
  return val || key
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

function renderPageHtml({ route, locale, page }) {
  let html = templateHtml

  // <html lang>
  html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale === 'zh-cn' ? 'zh-CN' : 'en'}"`)

  // title
  const suffix = locale === 'zh-cn' ? '基于 mdui 2 的开源文档系统' : 'Open-source docs system built on mdui 2'
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

  // #app 注入渲染的 markdown 正文（爬虫可读，client hydrate 时替换）
  let appContent = ''
  if (page) {
    const mdSource = readMd(locale, page.path)
    const mdHtml = renderMarkdown(mdSource)
    appContent = `<main class="prerender-shell"><article class="container markdown-body">${mdHtml}</article></main>`
  }
  html = html.replace(/<div\s+id="app">\s*<\/div>/, `<div id="app">${appContent}</div>`)

  return html
}

function main() {
  const locales = ['en', 'zh-cn']
  const routes = []
  for (const locale of locales) {
    const prefix = getLocalePrefix(locale)
    routes.push({ route: `${prefix}/`, locale, page: null })
    for (const page of docsPages) {
      const path = page.path ? `${prefix}/docs/${page.path}` : `${prefix}/docs/`
      routes.push({ route: path, locale, page })
    }
  }

  let ok = 0
  let fail = 0
  for (const item of routes) {
    try {
      const html = renderPageHtml(item)
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
  console.log(`[prerender] done: ${ok} ok, ${fail} fail`)
  if (fail > 0) process.exitCode = 1
}

main()
