import { computed, ref } from 'vue'
import { getLocaleFromPath } from '@/utils/site.js'
import { messages } from '@/i18n/messages.js'

export { messages }

function getStoredLocale() {
  if (typeof window === 'undefined') {
    return 'en'
  }

  return localStorage.getItem('mdui-locale') || 'en'
}

const currentLocale = ref(getStoredLocale())

function applyDocumentLanguage(locale) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.setAttribute('lang', locale === 'zh-cn' ? 'zh-CN' : 'en')
}

export function useI18n() {
  function t(key) {
    const keys = key.split('.')
    let val = messages[currentLocale.value]
    for (const k of keys) {
      val = val?.[k]
    }
    return val || key
  }

  function setLocale(locale) {
    currentLocale.value = locale
    if (typeof window !== 'undefined') {
      localStorage.setItem('mdui-locale', locale)
    }
    applyDocumentLanguage(locale)
  }

  function syncLocaleWithPath(path) {
    const localeFromPath = getLocaleFromPath(path)

    if (currentLocale.value !== localeFromPath) {
      setLocale(localeFromPath)
      return localeFromPath
    }

    applyDocumentLanguage(localeFromPath)
    return localeFromPath
  }

  function toggleLocale() {
    setLocale(currentLocale.value === 'en' ? 'zh-cn' : 'en')
  }

  const locale = computed(() => currentLocale.value)

  return { t, setLocale, syncLocaleWithPath, toggleLocale, locale }
}

applyDocumentLanguage(currentLocale.value)
