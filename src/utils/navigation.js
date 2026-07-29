// 站内链接拦截：把 <a> / mdui 组件 href 的同域左键点击转交给 vue-router，
// 避免整页刷新；保留 href 以支持 SEO、中键 / Cmd+Click 新标签等原生行为。

function findLinkElement(event) {
  // mdui 组件的 <a> 在 shadow DOM 内，需要用 composedPath 穿透查找
  const path = typeof event.composedPath === 'function' ? event.composedPath() : []
  for (const node of path) {
    if (node instanceof Element && (node.tagName === 'A' || node.hasAttribute('href'))) {
      return node
    }
  }
  return null
}

function shouldIntercept(event) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
}

export function installLinkInterceptor(router) {
  if (typeof document === 'undefined') return

  document.addEventListener('click', (event) => {
    if (!shouldIntercept(event)) return

    const link = findLinkElement(event)
    if (!link) return

    const target = link.getAttribute('target')
    if ((target && target !== '_self') || link.hasAttribute('download')) return

    const href = link.getAttribute('href') || ''
    // 只接管站内绝对路径；外链、纯锚点、mailto 等保持默认行为
    if (!href.startsWith('/') || href.startsWith('//')) return

    event.preventDefault()
    router.push(href)
  })
}
