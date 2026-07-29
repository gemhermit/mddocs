// 纯文本处理工具：浏览器与 Node 脚本（prerender / sitemap）共用，
// 避免 slugify / escapeHtml 等逻辑在多处复制后漂移。

export const headingAnchorPattern = /\s*\{#([A-Za-z0-9_-]+)\}\s*$/

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function escapeRegExp(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function slugify(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`"'“”‘’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

export function stripHeadingAnchor(value = '') {
  return String(value).replace(headingAnchorPattern, '').trim()
}
