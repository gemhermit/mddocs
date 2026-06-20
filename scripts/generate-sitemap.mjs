import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docsPages } from '../src/data/docs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const BASE_URL = (process.env.SITE_URL || 'https://gemhermit.github.io/mddocs').replace(/\/+$/, '')
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
        loc: `${BASE_URL}${locale.prefix}/docs/2${path}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: '0.8',
        alternates: locales.map((l) => ({
          hreflang: l.code,
          href: `${BASE_URL}${l.prefix}/docs/2${path}`,
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
