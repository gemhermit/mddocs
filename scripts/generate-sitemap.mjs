import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docsPages, docsSections } from '../src/data/docs.js'
import { messages } from '../src/i18n/messages.js'
import { SITE_URL } from '../src/utils/site.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const BASE_URL = (process.env.SITE_URL || SITE_URL).replace(/\/+$/, '')
const MAX_URLS_PER_SITEMAP = 2000

const today = new Date().toISOString().slice(0, 10)

const locales = [
  { code: 'en', prefix: '' },
  { code: 'zh-cn', prefix: '/zh-cn' },
]

function buildUrls() {
  const urls = []

  for (const locale of locales) {
    urls.push({
      loc: `${BASE_URL}${locale.prefix}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
      alternates: locales.map((l) => ({
        hreflang: l.code,
        href: `${BASE_URL}${l.prefix}/`,
      })),
    })

    for (const page of docsPages) {
      const path = page.path ? `/${page.path}` : ''
      urls.push({
        loc: `${BASE_URL}${locale.prefix}/docs${path}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8',
        alternates: locales.map((l) => ({
          hreflang: l.code,
          href: `${BASE_URL}${l.prefix}/docs${path}`,
        })),
      })
    }
  }

  return urls
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function renderUrlEntry(url) {
  const lines = ['  <url>']
  lines.push(`    <loc>${escapeXml(url.loc)}</loc>`)
  if (url.lastmod) lines.push(`    <lastmod>${url.lastmod}</lastmod>`)
  if (url.changefreq) lines.push(`    <changefreq>${url.changefreq}</changefreq>`)
  if (url.priority) lines.push(`    <priority>${url.priority}</priority>`)
  for (const alt of url.alternates) {
    lines.push(`    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`)
  }
  lines.push('  </url>')
  return lines.join('\n')
}

function renderSitemap(urls) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls.map(renderUrlEntry),
    '</urlset>',
  ].join('\n')
}

function renderSitemapIndex(sitemaps) {
  const entries = sitemaps.map((s) =>
    `  <sitemap>\n    <loc>${escapeXml(s.loc)}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`
  )
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</sitemapindex>',
  ].join('\n')
}

function renderRobotsTxt(sitemapUrl) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
  ].join('\n')
}

function translate(locale, key) {
  const keys = key.split('.')
  let val = messages[locale]
  for (const k of keys) {
    val = val?.[k]
  }
  return val || key
}

function homeUrl(localePrefix) {
  return `${BASE_URL}${localePrefix}/`
}

function docUrl(localePrefix, pagePath) {
  return pagePath
    ? `${BASE_URL}${localePrefix}/docs/${pagePath}`
    : `${BASE_URL}${localePrefix}/docs/`
}

// llms.txt: 精简入口，列出每个语言的核心页面，供 LLM 快速定位
function renderLlmsTxt() {
  const lines = []
  lines.push('# MDDocs')
  lines.push('')
  lines.push('> MDDocs is an open-source documentation system built with mdui 2, Vue 3, Vite, and Markdown. Markdown-first content, bilingual routes, sticky navigation, page table of contents, and code-copy interactions.')
  lines.push('')

  for (const locale of locales) {
    const langName = locale.code === 'zh-cn' ? '中文文档' : 'English docs'
    lines.push(`## ${langName}`)
    lines.push('')

    // 核心入口：首页 + Overview + Installation + Usage + AI overview
    const coreIds = ['introduction', 'installation', 'usage', 'ai-overview']
    for (const page of docsPages) {
      if (!coreIds.includes(page.id)) continue
      const title = translate(locale.code, page.titleKey)
      const url = docUrl(locale.prefix, page.path)
      lines.push(`- [${title}](${url})`)
    }
    lines.push('')
  }

  lines.push('## Additional resources')
  lines.push('')
  lines.push(`- [Full docs index](${BASE_URL}/llms-full.txt)`)
  lines.push(`- [Sitemap](${BASE_URL}/sitemap.xml)`)
  lines.push('')

  return lines.join('\n')
}

// llms-full.txt: 完整索引，按语言和章节分组
function renderLlmsFullTxt() {
  const lines = []
  lines.push('# MDDocs Full Documentation Index')
  lines.push('')
  lines.push('> MDDocs is an open-source documentation system built on mdui 2. Markdown-first content workflow, bilingual routes, sticky navigation, page table of contents, previous/next links, and code-copy interactions.')
  lines.push('')

  for (const locale of locales) {
    const langName = locale.code === 'zh-cn' ? '中文' : 'English'
    lines.push(`## ${langName}`)
    lines.push('')

    // 首页
    const homeTitle = locale.code === 'zh-cn' ? '首页' : 'Home'
    lines.push(`- [${homeTitle}](${homeUrl(locale.prefix)})`)

    // 按章节分组
    for (const section of docsSections) {
      const sectionTitle = translate(locale.code, section.titleKey)
      for (const item of section.items) {
        const title = translate(locale.code, item.titleKey)
        const url = docUrl(locale.prefix, item.path)
        lines.push(`- [${sectionTitle} / ${title}](${url})`)
      }
    }
    lines.push('')
  }

  return lines.join('\n')
}

// --- main ---
const publicDir = join(ROOT, 'public')
mkdirSync(publicDir, { recursive: true })

const allUrls = buildUrls()
const chunks = []
for (let i = 0; i < allUrls.length; i += MAX_URLS_PER_SITEMAP) {
  chunks.push(allUrls.slice(i, i + MAX_URLS_PER_SITEMAP))
}

if (chunks.length === 1) {
  const xml = renderSitemap(chunks[0])
  writeFileSync(join(publicDir, 'sitemap.xml'), xml, 'utf-8')
  const robots = renderRobotsTxt(`${BASE_URL}/sitemap.xml`)
  writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf-8')
  console.log(`Generated sitemap.xml (${allUrls.length} urls)`)
} else {
  const indexEntries = []
  for (let i = 0; i < chunks.length; i++) {
    const filename = `sitemap-${i}.xml`
    const xml = renderSitemap(chunks[i])
    writeFileSync(join(publicDir, filename), xml, 'utf-8')
    indexEntries.push({ loc: `${BASE_URL}/${filename}` })
    console.log(`Generated ${filename} (${chunks[i].length} urls)`)
  }
  const indexXml = renderSitemapIndex(indexEntries)
  writeFileSync(join(publicDir, 'sitemap.xml'), indexXml, 'utf-8')
  const robots = renderRobotsTxt(`${BASE_URL}/sitemap.xml`)
  writeFileSync(join(publicDir, 'robots.txt'), robots, 'utf-8')
  console.log(`Generated sitemap.xml (index, ${chunks.length} sub-sitemaps)`)
}
console.log('Generated robots.txt')

// llms.txt / llms-full.txt
writeFileSync(join(publicDir, 'llms.txt'), renderLlmsTxt(), 'utf-8')
console.log('Generated llms.txt')
writeFileSync(join(publicDir, 'llms-full.txt'), renderLlmsFullTxt(), 'utf-8')
console.log('Generated llms-full.txt')
