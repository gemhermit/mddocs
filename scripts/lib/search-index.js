// 构建期搜索索引。
//
// 旧版实现在前端：打开搜索时并发拉取全部 Markdown（中英各 15 篇，共 30 个请求），
// 再用正则把 Markdown 剥成纯文本建索引。现在改为构建期把索引算好，每个语言产出
// 一个文件，前端首次打开搜索时只请求当前语言的那一个文件。
//
// 记录结构（运行时再拼装页面信息与展示文案）：
//   { id, type: 'page' | 'section', pageId, hash, titleKey, title?, bodyText }

import { docsPages } from '../../src/data/docs.js'

// 去掉 Markdown 语法，只保留可检索的纯文本
export function stripMarkdown(source = '') {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\s*\{#[A-Za-z0-9_-]+\}\s*/g, ' ')
    .replace(/^[\s>*-]*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[|*_~>#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function slugifyHeading(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[`"'“”‘’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

function stripHeadingAnchor(value = '') {
  return String(value).replace(/\s*\{#([A-Za-z0-9_-]+)\}\s*$/, '').trim()
}

// 逐行扫描标题，复刻渲染期的 id 生成规则（显式锚点优先，其次 slug，重复则加序号）
function getHeadingIds(source = '') {
  const seen = new Map()
  const ids = new Map()

  source.split(/\r?\n/).forEach((line, index) => {
    const match = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*$/)
    if (!match) return

    const explicitId = match[2].match(/\s*\{#([A-Za-z0-9_-]+)\}\s*$/)?.[1]
    const baseId = explicitId || slugifyHeading(stripHeadingAnchor(match[2])) || `heading-${index}`
    const count = seen.get(baseId) || 0
    seen.set(baseId, count + 1)
    ids.set(index, count > 0 ? `${baseId}-${count + 1}` : baseId)
  })

  return ids
}

// 按 h2 / h3 切段，每段记录锚点与正文纯文本
function getSectionRecords(source = '', page) {
  const lines = source.split(/\r?\n/)
  const headingIds = getHeadingIds(source)
  const sections = []
  let current = null

  lines.forEach((line, index) => {
    const match = line.match(/^\s{0,3}(#{2,3})\s+(.+?)\s*$/)
    if (match) {
      if (current) sections.push(current)
      current = {
        id: headingIds.get(index) || `section-${index}`,
        heading: stripHeadingAnchor(match[2]),
        body: []
      }
      return
    }

    if (current) {
      current.body.push(line)
    }
  })

  if (current) sections.push(current)

  return sections.map((section) => ({
    id: `${page.id}-${section.id}`,
    type: 'section',
    pageId: page.id,
    hash: section.id,
    titleKey: page.titleKey,
    title: section.heading,
    bodyText: stripMarkdown(section.body.join('\n'))
  }))
}

// 为某个语言生成完整索引：每个页面一条整页记录 + 每个 h2/h3 章节一条记录
export function buildSearchRecords(sources = {}) {
  const records = []

  for (const page of docsPages) {
    const source = sources[page.path || 'introduction'] || ''
    const bodyText = stripMarkdown(source)

    records.push({
      id: `${page.id}-page`,
      type: 'page',
      pageId: page.id,
      hash: '',
      titleKey: page.titleKey,
      bodyText
    })

    records.push(...getSectionRecords(source, page))
  }

  return records
}
