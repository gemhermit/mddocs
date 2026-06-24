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
