import MarkdownIt from 'markdown-it'

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function slugify(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`"'“”‘’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

const headingAnchorPattern = /\s*\{#([A-Za-z0-9_-]+)\}\s*$/

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
  })
})

md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const rendered = defaultFence(tokens, idx, options, env, self)
  return `<div class="code-container">${rendered}</div>`
}

export function renderMarkdown(source = '') {
  return md.render(source)
}
