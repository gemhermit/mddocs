import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)

async function copyToClipboard(text) {
  try {
    await navigator.clipboard?.writeText(text)
    return true
  } catch {
    // Fall through to the textarea fallback below.
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    return document.execCommand('copy')
  } finally {
    textarea.remove()
  }
}

/**
 * Highlight a single <code> element if it has a language-* class.
 * Mirrors the original site behaviour: marks the element with
 * data-highlighted="yes" and adds the `hljs` class.
 */
export function highlightElement(el) {
  if (el.dataset.highlighted === 'yes') return
  const codeEl = el.tagName === 'CODE' ? el : el.querySelector('code')
  if (!codeEl) return

  // Derive language from class list (language-xxx / lang-xxx)
  const langClass = Array.from(codeEl.classList).find((c) =>
    c.startsWith('language-') || c.startsWith('lang-')
  )
  const language = langClass ? langClass.replace(/^lang(uage)?-/, '') : ''

  if (language && hljs.getLanguage(language)) {
    const result = hljs.highlight(codeEl.textContent, { language })
    codeEl.innerHTML = result.value
  } else {
    // Auto-detect as a fallback
    codeEl.textContent = codeEl.textContent
  }
  codeEl.classList.add('hljs')
  codeEl.dataset.highlighted = 'yes'
}

/**
 * Highlight every <pre><code> inside a given root element.
 */
export function highlightAll(root = document) {
  root.querySelectorAll('pre code').forEach((code) => highlightElement(code))
  enhanceCodeBlocks(root)
}

export function enhanceCodeBlocks(root = document) {
  root.querySelectorAll('pre').forEach((pre) => {
    if (pre.dataset.copyReady === 'yes') return

    const code = pre.querySelector('code')
    if (!code) return

    let container = pre.closest('.code-container')
    if (!container) {
      container = document.createElement('div')
      container.className = 'code-container'
      pre.parentNode?.insertBefore(container, pre)
      container.appendChild(pre)
    }

    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'code-copy-button'
    button.setAttribute('aria-label', 'Copy code')
    button.innerHTML = '<mdui-icon name="content_copy--rounded"></mdui-icon>'
    button.addEventListener('click', async () => {
      const copied = await copyToClipboard(code.textContent || '')
      button.classList.toggle('copied', copied)
      button.classList.toggle('copy-failed', !copied)
      button.innerHTML = copied
        ? '<mdui-icon name="check--rounded"></mdui-icon>'
        : '<mdui-icon name="error_outline--rounded"></mdui-icon>'
      window.setTimeout(() => {
        button.classList.remove('copied')
        button.classList.remove('copy-failed')
        button.innerHTML = '<mdui-icon name="content_copy--rounded"></mdui-icon>'
      }, 1200)
    })

    container.appendChild(button)
    pre.dataset.copyReady = 'yes'
  })
}

/**
 * Vue directive: v-highlight — attach to a container; it highlights all
 * descendant code blocks on mount and whenever the subtree mutates.
 */
export const vHighlight = {
  mounted(el) {
    highlightAll(el)
  },
  updated(el) {
    highlightAll(el)
  },
}
