import MarkdownIt from 'markdown-it'
import { escapeHtml, headingAnchorPattern, slugify } from './text.js'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
  highlight(str, lang) {
    const language = lang ? ` language-${escapeHtml(lang)}` : ''
    return `<pre><code class="${language.trim()}">${escapeHtml(str)}</code></pre>`
  }
})

const defaultFence = md.renderer.rules.fence

// 提取标题纯文本（去除行内 markdown 语法），供 TOC 直接使用
function getInlineText(inline) {
  const text = (inline.children || [])
    .filter((child) => child.type === 'text' || child.type === 'code_inline')
    .map((child) => child.content)
    .join('')
    .trim()
  return text || inline.content.replace(headingAnchorPattern, '').trim()
}

md.core.ruler.push('heading_ids', (state) => {
  const seen = new Map()

  state.tokens.forEach((token, index) => {
    if (token.type !== 'heading_open') return

    const inline = state.tokens[index + 1]
    if (!inline || inline.type !== 'inline') return

    const anchorMatch = inline.content.match(headingAnchorPattern)
    let id = anchorMatch?.[1] || slugify(inline.content)

    if (anchorMatch) {
      inline.content = inline.content.replace(headingAnchorPattern, '')
      const lastText = [...(inline.children || [])].reverse().find((child) => child.type === 'text')
      if (lastText) {
        lastText.content = lastText.content.replace(headingAnchorPattern, '')
      }
    }

    if (!id) id = `heading-${index}`
    const count = seen.get(id) || 0
    seen.set(id, count + 1)
    if (count > 0) id = `${id}-${count + 1}`

    token.attrSet('id', id)

    // 渲染时顺便收集标题元数据，免得前端再从 DOM 里抓
    if (Array.isArray(state.env.headings)) {
      state.env.headings.push({
        id,
        level: Number(token.tag.slice(1)) || 0,
        text: getInlineText(inline)
      })
    }
  })
})

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const rendered = defaultFence(tokens, idx, options, env, self)
  return `<div class="code-container">${rendered}</div>`
}

export function renderMarkdown(source = '') {
  return md.render(source)
}

// 返回 html + 标题列表，TOC 等需要结构化数据的场景用这个
export function renderMarkdownWithMeta(source = '') {
  const env = { headings: [] }
  const html = md.render(source, env)
  return { html, headings: env.headings }
}
