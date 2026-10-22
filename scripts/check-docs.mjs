// 文档一致性校验：把原来靠人肉检查的几件事变成可执行的脚本
//  1. src/data/docs.js 里登记的每个页面，中英文 Markdown 都必须存在
//  2. content 目录下不能有「没被登记」的孤儿 Markdown
//  3. 中英文页面的章节数量应当一致（不一致只告警，不阻断）
//  4. 如果 dist/ 存在，校验预渲染产物是否覆盖全部路由
//
// 用法：node scripts/check-docs.mjs（CI 与 pnpm run check:docs 都会调用）

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { docsPages } from '../src/data/docs.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONTENT_DIR = join(ROOT, 'src/content/docs')
const DIST = join(ROOT, 'dist')
const LOCALES = ['en', 'zh-cn']

const errors = []
const warnings = []

function mdFileFor(locale, pagePath) {
  const relativePath = pagePath ? `${pagePath}.md` : 'introduction.md'
  return join(CONTENT_DIR, locale, relativePath)
}

// 统计标题行：先去掉围栏代码块，避免把 shell/nginx 注释里的 # 当成标题
function countHeadings(source = '') {
  const lines = []
  let inFence = false

  for (const line of source.split(/\r?\n/)) {
    if (/^\s{0,3}(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (!inFence) lines.push(line)
  }

  return lines.filter((line) => /^\s{0,3}#{1,6}\s+\S/.test(line)).length
}

function listMarkdownFiles(dir) {
  if (!existsSync(dir)) return []
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...listMarkdownFiles(full))
    } else if (entry.endsWith('.md')) {
      files.push(full)
    }
  }
  return files
}

// 1 + 3：每个登记页面都要有中英文内容，且章节数一致
for (const page of docsPages) {
  const sources = {}

  for (const locale of LOCALES) {
    const file = mdFileFor(locale, page.path)
    if (!existsSync(file)) {
      errors.push(`缺少内容文件：${relative(ROOT, file)}（页面 id=${page.id}）`)
      continue
    }
    sources[locale] = readFileSync(file, 'utf-8')
  }

  if (sources.en && sources['zh-cn']) {
    const enHeadings = countHeadings(sources.en)
    const zhHeadings = countHeadings(sources['zh-cn'])
    if (enHeadings !== zhHeadings) {
      warnings.push(
        `章节数不一致：${page.id}（en ${enHeadings} 个 / zh-cn ${zhHeadings} 个）`
      )
    }
  }
}

// 2：孤儿 Markdown（存在但没在 docs.js 登记）
const registered = new Set()
for (const locale of LOCALES) {
  for (const page of docsPages) {
    registered.add(join(CONTENT_DIR, locale, page.path ? `${page.path}.md` : 'introduction.md'))
  }
}
for (const file of listMarkdownFiles(CONTENT_DIR)) {
  if (!registered.has(file)) {
    errors.push(`孤儿内容文件（未登记到 src/data/docs.js）：${relative(ROOT, file)}`)
  }
}

// 4：预渲染产物覆盖检查
if (existsSync(DIST)) {
  for (const locale of LOCALES) {
    const prefix = locale === 'zh-cn' ? '/zh-cn' : ''
    const expected = [
      `${prefix}/`,
      ...docsPages.map((page) =>
        page.path ? `${prefix}/docs/${page.path}` : `${prefix}/docs`
      )
    ]
    for (const route of expected) {
      const clean = route.replace(/^\/+/, '').replace(/\/+$/, '')
      const file = clean ? join(DIST, clean, 'index.html') : join(DIST, 'index.html')
      if (!existsSync(file)) {
        errors.push(`预渲染产物缺失：${route} → ${relative(ROOT, file)}`)
      }
    }
  }
}

for (const warning of warnings) {
  console.warn(`[warn] ${warning}`)
}
for (const error of errors) {
  console.error(`[error] ${error}`)
}

if (errors.length) {
  console.error(`\n文档校验失败：${errors.length} 个错误，${warnings.length} 个告警`)
  process.exit(1)
}

console.log(`文档校验通过：${docsPages.length} 个页面 × ${LOCALES.length} 种语言，${warnings.length} 个告警`)
