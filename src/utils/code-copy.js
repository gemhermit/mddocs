// 代码块复制按钮。
//
// 语法高亮已经在构建期完成（见 scripts/lib/markdown.js），所以浏览器端不需要
// highlight.js，这里只负责给代码块挂一个「复制」按钮 —— 纯 DOM 操作，无依赖。

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
 * 给 root 下所有代码块挂上复制按钮。
 * 代码块在构建期已经带好 .code-container 包裹，这里只做兜底补齐。
 */
export function enhanceCodeBlocks(root = document, { copyLabel = 'Copy code' } = {}) {
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

    const button = document.createElement('mdui-button-icon')
    button.className = 'code-copy-button'
    button.setAttribute('aria-label', copyLabel)
    const icon = document.createElement('mdui-icon')
    icon.setAttribute('name', 'content_copy--rounded')
    button.appendChild(icon)
    button.addEventListener('click', async () => {
      const copied = await copyToClipboard(code.textContent || '')
      button.classList.toggle('copied', copied)
      button.classList.toggle('copy-failed', !copied)
      icon.setAttribute('name', copied ? 'check--rounded' : 'error_outline--rounded')
      window.setTimeout(() => {
        button.classList.remove('copied')
        button.classList.remove('copy-failed')
        icon.setAttribute('name', 'content_copy--rounded')
      }, 1200)
    })

    container.appendChild(button)
    pre.dataset.copyReady = 'yes'
  })
}
