// 构建期 Markdown 渲染器。
//
// 这里只服务于 Node 构建脚本，**不会进入浏览器包**：文档正文在构建期就渲染成
// HTML，客户端只负责把这段 HTML 放进 DOM，因此 markdown-it / highlight.js
// 都不再出现在前端产物的 JS 里。
//
// 渲染结果与旧版客户端渲染保持一致：
//   - 标题自动生成 id，支持 `{#custom-id}` 显式锚点
//   - 代码块外面包一层 .code-container（复制按钮的挂载点）
//   - 代码块在构建期就完成语法高亮，<code> 上带 language-* 与 hljs class

import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import plaintext from 'highlight.js/lib/languages/plaintext'
import scss from 'highlight.js/lib/languages/scss'
import shell from 'highlight.js/lib/languages/shell'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import { escapeHtml, headingAnchorPattern, slugify } from '../../src/utils/text.js'

// 注册文档常用语言；别名（js/ts/html/sh/yml/md 等）由语言定义自带
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('css', css)
hljs.registerLanguage('diff', diff)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('shell', shell)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)

// 代码高亮：显式语言优先，未声明语言时按已注册语言自动探测
export function highlightCode(code, language = '') {
  const lang = language.trim().toLowerCase()

  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
    } catch {
      // 落到自动探测
    }
  }

  if (code.trim()) {
    try {
      return hljs.highlightAuto(code).value
    } catch {
      // 落到转义
    }
  }

  return escapeHtml(code)
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false
})

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

// 自定义 fence 渲染：构建期完成高亮，并保留 language-* / hljs class
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = token.info ? md.utils.escapeHtml(token.info.trim()) : ''
  const language = info.split(/\s+/g)[0] || ''
  const highlighted = highlightCode(token.content, language)
  const className = language ? `hljs language-${language}` : 'hljs'

  return `<div class="code-container"><pre><code class="${className}">${highlighted}</code></pre></div>`
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
