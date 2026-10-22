// 构建期内容生成：Markdown → 预渲染 HTML + 标题元数据 + 搜索索引。
//
// 产物写在 src/content/generated/（已 gitignore），由 Vite 通过 import.meta.glob
// 打包成按需加载的 chunk：
//   src/content/generated/pages/<locale>/<page>.js   → { html, headings }
//   src/content/generated/search/<locale>.js         → { records }
//
// 这样浏览器端不再需要 markdown-it / dompurify / highlight.js，
// 文档正文与搜索索引都变成「构建期算好、客户端直接用」。

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docsPages } from '../src/data/docs.js'
import { renderMarkdownWithMeta } from './lib/markdown.js'
import { sanitizeHtml } from './lib/sanitize.mjs'
import { buildSearchRecords } from './lib/search-index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'src/content/docs')
const OUT_DIR = join(ROOT, 'src/content/generated')
const LOCALES = ['en', 'zh-cn']

function writeModule(filePath, exports) {
  mkdirSync(dirname(filePath), { recursive: true })
  const body = Object.entries(exports)
    .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)}`)
    .join('\n')
  writeFileSync(filePath, `${body}\n`, 'utf-8')
  return Buffer.byteLength(body)
}

function readSource(locale, pagePath) {
  const file = join(CONTENT_DIR, locale, pagePath ? `${pagePath}.md` : 'introduction.md')
  if (!existsSync(file)) return ''
  return readFileSync(file, 'utf-8')
}

function main() {
  // 每次重建前清空，避免删掉页面后残留旧 chunk
  rmSync(OUT_DIR, { recursive: true, force: true })
  mkdirSync(OUT_DIR, { recursive: true })

  let pageCount = 0
  let missing = 0
  let totalBytes = 0

  for (const locale of LOCALES) {
    const sources = {}

    for (const page of docsPages) {
      const pagePath = page.path || 'introduction'
      const source = readSource(locale, page.path)
      if (!source) {
        missing++
        console.warn(`[build-content] 缺少内容：${locale}/${pagePath}.md`)
      }
      sources[page.path || 'introduction'] = source

      const { html, headings } = renderMarkdownWithMeta(source)
      const safeHtml = sanitizeHtml(html)

      const bytes = writeModule(join(OUT_DIR, 'pages', locale, `${pagePath}.js`), {
        html: safeHtml,
        headings
      })
      totalBytes += bytes
      pageCount++
    }

    const records = buildSearchRecords(sources)
    const bytes = writeModule(join(OUT_DIR, 'search', `${locale}.js`), { records })
    totalBytes += bytes

    console.log(`[build-content] ${locale}: ${docsPages.length} 个页面 + ${records.length} 条搜索记录`)
  }

  console.log(
    `[build-content] 完成：${pageCount} 个页面模块，${(totalBytes / 1024).toFixed(1)} KB（未压缩）`
  )
  if (missing) {
    console.warn(`[build-content] 有 ${missing} 个页面缺少 Markdown 内容`)
  }
}

main()
