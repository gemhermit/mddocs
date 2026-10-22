import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docsPages, docsSections } from '../src/data/docs.js'
import { translate } from '../src/i18n/messages.js'
import { SITE_URL } from '../src/utils/site.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'src/content/docs')

const BASE_URL = (process.env.SITE_URL || SITE_URL).replace(/\/+$/, '')
const MAX_URLS_PER_SITEMAP = 2000

const today = new Date().toISOString().slice(0, 10)

const locales = [
  { code: 'en', prefix: '', hreflang: 'en' },
  { code: 'zh-cn', prefix: '/zh-cn', hreflang: 'zh-CN' },
]

// lastmod 取内容文件的最后提交时间，避免每次构建都把日期改成"今天"，
// 让 sitemap 的 lastmod 真正反映内容更新，而不是构建时间。
function gitLastmod(relativePath) {
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
      cwd: ROOT,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
    return output ? output.slice(0, 10) : null
  } catch {
    // 没有 git 或不在仓库里：退回今天
    return null
  }
}

function contentRelativePath(locale, pagePath) {
  return join('src/content/docs', locale, pagePath ? `${pagePath}.md` : 'introduction.md')
}

function pageLastmod(locale, page) {
  return gitLastmod(contentRelativePath(locale, page.path)) || today
}

function readContent(locale, pagePath) {
  const file = join(CONTENT_DIR, locale, pagePath ? `${pagePath}.md` : 'introduction.md')
  if (!existsSync(file)) return ''
  return readFileSync(file, 'utf-8').trim()
}

function buildUrls() {
  const urls = []
  const homeLastmod = docsPages
    .map((page) => pageLastmod('en', page))
    .sort()
    .pop() || today

  for (const locale of locales) {
    urls.push({
      loc: `${BASE_URL}${locale.prefix}/`,
      lastmod: homeLastmod,
      changefreq: 'weekly',
      priority: '1.0',
      alternates: locales.map((l) => ({
        hreflang: l.hreflang,
        href: `${BASE_URL}${l.prefix}/`,
      })),
    })

    for (const page of docsPages) {
      const path = page.path ? `/${page.path}` : ''
      urls.push({
        loc: `${BASE_URL}${locale.prefix}/docs${path}`,
        lastmod: pageLastmod(locale.code, page),
        changefreq: 'weekly',
        priority: '0.8',
        alternates: locales.map((l) => ({
          hreflang: l.hreflang,
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
  // ROBOTS_NOINDEX=1：用于「镜像部署」—— 站点主域名在别处（如 Vercel），
  // 这份副本只作为可访问的备份，必须让搜索引擎不要收录，否则两份内容互相竞争。
  if (process.env.ROBOTS_NOINDEX === '1') {
    return [
      'User-agent: *',
      'Disallow: /',
      '',
      ''
    ].join('\n')
  }

  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    '',
    ''
  ].join('\n')
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
  lines.push(`- [Full docs with complete page content](${BASE_URL}/llms-full.txt)`)
  lines.push(`- [Sitemap](${BASE_URL}/sitemap.xml)`)
  lines.push('')

  return lines.join('\n')
}

// llms-full.txt: 完整索引 + 每页正文（Markdown 原文），供 LLM 直接引用
function renderLlmsFullTxt() {
  const lines = []
  lines.push('# MDDocs Full Documentation')
  lines.push('')
  lines.push('> Complete documentation of MDDocs, an open-source documentation system built with mdui 2, Vue 3, Vite, and Markdown. Each section below contains the full page source, so the content can be used directly without fetching the site.')
  lines.push('')

  for (const locale of locales) {
    const langName = locale.code === 'zh-cn' ? '中文' : 'English'
    lines.push(`## ${langName}`)
    lines.push('')

    // 首页
    const homeTitle = locale.code === 'zh-cn' ? '首页' : 'Home'
    lines.push(`### ${homeTitle}`)
    lines.push(`URL: ${homeUrl(locale.prefix)}`)
    lines.push('')

    // 按章节分组，章节标题下带每页正文
    for (const section of docsSections) {
      const sectionTitle = translate(locale.code, section.titleKey)
      lines.push(`### ${sectionTitle}`)
      lines.push('')

      for (const item of section.items) {
        const title = translate(locale.code, item.titleKey)
        const url = docUrl(locale.prefix, item.path)
        const content = readContent(locale.code, item.path)

        lines.push(`#### ${title}`)
        lines.push(`URL: ${url}`)
        lines.push('')
        if (content) {
          lines.push(content)
          lines.push('')
        }
      }
    }
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
  console.log('Generated sitemap.xml')
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
  console.log('Generated sitemap.xml (index)')
}
console.log(`Generated robots.txt (${allUrls.length} urls)`)

// llms.txt / llms-full.txt
writeFileSync(join(publicDir, 'llms.txt'), renderLlmsTxt(), 'utf-8')
console.log('Generated llms.txt')
writeFileSync(join(publicDir, 'llms-full.txt'), renderLlmsFullTxt(), 'utf-8')
console.log('Generated llms-full.txt (with full page content)')
