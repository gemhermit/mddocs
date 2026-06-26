export const SITE_URL = 'https://gemhermit.github.io/mddocs'

export function toAbsoluteUrl(path = '/') {
  const base = SITE_URL.replace(/\/+$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${cleanPath}`
}

export function getLocaleFromPath(path = '/') {
  return path.startsWith('/zh-cn') ? 'zh-cn' : 'en'
}

export function getLocalePrefix(locale = 'en') {
  return locale === 'zh-cn' ? '/zh-cn' : ''
}

export function stripLocalePrefix(path = '/') {
  if (path.startsWith('/zh-cn')) {
    return path.slice('/zh-cn'.length) || '/'
  }

  return path || '/'
}

export function toLocalePath(path = '/', locale = 'en') {
  const normalizedPath = stripLocalePrefix(path)
  const prefixedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`

  return `${getLocalePrefix(locale)}${prefixedPath}` || '/'
}

export function getDocsBase(locale = 'en') {
  return `${getLocalePrefix(locale)}/docs`
}
