// 站点基址、部署前缀与多语言路径工具。
//
// - SITE_URL：站点对外规范地址。构建期可用环境变量覆盖（浏览器端读
//   import.meta.env.SITE_URL，Node 端读 process.env.SITE_URL），
//   默认值是线上真实域名；旧的 gemhermit.github.io/mddocs 整站 404，不要再写死。
// - BASE_URL：部署在子路径时由 Vite 注入（如 GitHub Pages 的 /mddocs/），
//   根路径部署为 '/'。站内 DOM 链接需要带上它，router.push 则不需要。
//
// 浏览器与 Node 脚本（prerender / sitemap）共用本文件，避免两处逻辑漂移。

const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const nodeEnv = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env) || {}

export const DEFAULT_SITE_URL = 'https://mddocs.bago.top'

export const SITE_URL = (
  viteEnv.SITE_URL ||
  viteEnv.VITE_SITE_URL ||
  nodeEnv.SITE_URL ||
  nodeEnv.VITE_SITE_URL ||
  DEFAULT_SITE_URL
).replace(/\/+$/, '')

// 归一化部署前缀：'/' 或以 '/' 结尾的子路径
export const BASE_URL = (() => {
  const base = viteEnv.BASE_URL || '/'
  if (!base || base === '/') return '/'
  return base.endsWith('/') ? base : `${base}/`
})()

// 不含尾部斜杠的 base 前缀：'' 或 '/mddocs'
const BASE_PREFIX = BASE_URL === '/' ? '' : BASE_URL.replace(/\/+$/, '')

// 给站内路径补上部署前缀（用于 DOM 上的 href）
export function withBase(path = '/') {
  const clean = String(path).replace(/^\/+/, '')
  return clean ? `${BASE_URL}${clean}` : BASE_URL
}

// 去掉部署前缀（用于 router.push 这类应用内跳转）
export function stripBase(path = '/') {
  if (!BASE_PREFIX) return path
  if (path === BASE_PREFIX) return '/'
  if (path.startsWith(`${BASE_PREFIX}/`)) return path.slice(BASE_PREFIX.length) || '/'
  return path
}

export function toAbsoluteUrl(path = '/') {
  const base = SITE_URL.replace(/\/+$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

export function getLocaleFromPath(path = '/') {
  return path.startsWith('/zh-cn') ? 'zh-cn' : 'en'
}

export function getLocalePrefix(locale = 'en') {
  return locale === 'zh-cn' ? `${BASE_PREFIX}/zh-cn` : BASE_PREFIX
}

export function stripLocalePrefix(path = '/') {
  if (path.startsWith('/zh-cn')) {
    return path.slice('/zh-cn'.length) || '/'
  }

  return path || '/'
}

export function toLocalePath(path = '/', locale = 'en') {
  const normalizedPath = stripLocalePrefix(stripBase(path))
  const prefixedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`

  return `${getLocalePrefix(locale)}${prefixedPath}` || '/'
}

export function getDocsBase(locale = 'en') {
  return `${getLocalePrefix(locale)}/docs`
}
