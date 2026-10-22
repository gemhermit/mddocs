<template>
  <mdui-tooltip :content="t('search.tooltip')">
    <mdui-button-icon class="search-trigger" :aria-label="t('search.tooltip')" @click="openSearch">
      <mdui-icon name="search--rounded"></mdui-icon>
    </mdui-button-icon>
  </mdui-tooltip>

  <Teleport to="body">
    <div v-if="isOpen" class="doc-search-overlay" @click.self="closeSearch">
      <section
        ref="panelRef"
        class="doc-search-panel"
        role="dialog"
        aria-modal="true"
        :aria-label="t('search.title')"
        @keydown="onPanelKeydown"
      >
        <div class="doc-search-field">
          <mdui-icon name="search--rounded"></mdui-icon>
          <input
            ref="inputRef"
            v-model="query"
            class="doc-search-input"
            type="search"
            role="combobox"
            aria-autocomplete="list"
            :aria-expanded="results.length > 0 ? 'true' : 'false'"
            :aria-activedescendant="results.length ? `doc-search-option-${activeIndex}` : undefined"
            :placeholder="t('search.placeholder')"
            @keydown.enter.prevent="openActiveResult"
          >
          <mdui-button-icon class="doc-search-close" :aria-label="t('search.close')" @click="closeSearch">
            <mdui-icon name="close--rounded"></mdui-icon>
          </mdui-button-icon>
        </div>

        <div class="doc-search-status">{{ statusText }}</div>

        <div v-if="results.length" class="doc-search-results" role="listbox">
          <a
            v-for="(result, index) in results"
            :id="`doc-search-option-${index}`"
            :key="result.id"
            class="doc-search-result"
            :class="{ 'is-active': index === activeIndex }"
            role="option"
            :aria-selected="index === activeIndex"
            :href="result.href"
            @mouseenter="activeIndex = index"
            @click="closeSearch"
          >
            <span class="doc-search-section">{{ result.sectionTitle }}</span>
            <span class="doc-search-title">{{ result.title }}</span>
            <span class="doc-search-excerpt" v-html="result.excerptHtml"></span>
          </a>
        </div>

        <div v-else-if="localeSuggestion" class="doc-search-hint">
          <span>{{ t('search.otherLocaleHint') }}</span>
          <mdui-button variant="tonal" @click="switchToOtherLocale">
            {{ locale === 'en' ? '中文' : 'English' }}
          </mdui-button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { docsPages, docsSections } from '@/data/docs.js'
import { useI18n } from '@/i18n/index.js'
import { translate } from '@/i18n/messages.js'
import { getDocsBase, toLocalePath } from '@/utils/site.js'
import { escapeHtml, escapeRegExp } from '@/utils/text.js'

// 搜索索引在构建期生成，每个语言一个文件；首次打开搜索时只加载当前语言的那一个。
const indexLoaders = import.meta.glob('/src/content/generated/search/*.js')

const localeLoaders = Object.entries(indexLoaders).reduce((result, [filePath, loader]) => {
  const match = filePath.match(/\/content\/generated\/search\/(.+)\.js$/)
  if (match) result[match[1]] = loader
  return result
}, {})

// 索引在组件外缓存：切换语言时不必重新拉取，组件重建后查询词也能保留
const indexCache = new Map()
// 已加载的索引同时存一份响应式副本，computed 才能感知「索引加载完成」
const loadedRecords = ref({})
let lastQuery = ''

const router = useRouter()
const route = useRoute()
const { t, locale, setLocale } = useI18n()
const isOpen = ref(false)
const query = ref('')
// 输入防抖后再参与检索，避免文档规模大时每个字符都全量匹配
const debouncedQuery = ref('')
const activeIndex = ref(0)
const inputRef = ref(null)
const panelRef = ref(null)

const pageById = new Map(docsPages.map((page) => [page.id, page]))

const sectionTitleKeys = docsSections.reduce((result, section) => {
  result[section.value] = section.titleKey
  return result
}, {})

function normalizeSearch(value = '') {
  return String(value).toLocaleLowerCase().replace(/\s+/g, ' ').trim()
}

function getQueryTerms(value = '') {
  return normalizeSearch(value).split(' ').filter(Boolean)
}

async function ensureIndexLoaded(activeLocale) {
  if (indexCache.has(activeLocale)) return indexCache.get(activeLocale)
  if (!localeLoaders[activeLocale]) return null

  const promise = localeLoaders[activeLocale]()
    .then((module) => {
      const records = module?.records || []
      indexCache.set(activeLocale, records)
      loadedRecords.value = { ...loadedRecords.value, [activeLocale]: records }
      return records
    })
    .catch(() => {
      indexCache.set(activeLocale, [])
      loadedRecords.value = { ...loadedRecords.value, [activeLocale]: [] }
      return []
    })

  return promise
}

function createHighlightedExcerpt(text = '', terms = []) {
  const plainText = text.replace(/\s+/g, ' ').trim()
  if (!plainText) return ''

  const lowerText = plainText.toLocaleLowerCase()
  const firstMatch = terms.reduce((match, term) => {
    const index = lowerText.indexOf(term)
    return index >= 0 && (match < 0 || index < match) ? index : match
  }, -1)

  const start = Math.max(0, firstMatch - 56)
  const end = firstMatch >= 0
    ? Math.min(plainText.length, firstMatch + 144)
    : Math.min(plainText.length, 180)
  const excerpt = `${start > 0 ? '...' : ''}${plainText.slice(start, end)}${end < plainText.length ? '...' : ''}`
  const highlightedTerms = terms.filter((term) => term.length)

  if (!highlightedTerms.length) return escapeHtml(excerpt)

  const pattern = new RegExp(`(${highlightedTerms.map(escapeRegExp).join('|')})`, 'gi')
  return excerpt.split(pattern).map((part) => {
    const isMatch = highlightedTerms.includes(part.toLocaleLowerCase())
    return isMatch ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)
  }).join('')
}

const searchIndex = computed(() => {
  const activeLocale = locale.value
  const records = loadedRecords.value[activeLocale] || []

  return records.map((record) => {
    const page = pageById.get(record.pageId)
    const pageTitle = page ? translate(activeLocale, page.titleKey) : ''
    const title = record.type === 'page' ? pageTitle : record.title

    return {
      id: record.id,
      type: record.type,
      page,
      hash: record.hash,
      title,
      bodyText: record.bodyText,
      searchText: normalizeSearch(`${title} ${record.bodyText}`)
    }
  })
})

function scoreRecord(record, terms, fullQuery) {
  if (!terms.every((term) => record.searchText.includes(term))) return 0

  const titleText = normalizeSearch(record.title)
  let score = record.type === 'page' ? 8 : 12

  if (titleText.includes(fullQuery)) score += 90
  if (record.searchText.includes(fullQuery)) score += 30

  terms.forEach((term) => {
    if (titleText.includes(term)) score += 30
    const position = record.searchText.indexOf(term)
    if (position >= 0) score += Math.max(1, 20 - Math.floor(position / 60))
  })

  return score
}

function resultHref(page, hash = '') {
  const basePath = page.path ? `${getDocsBase(locale.value)}/${page.path}` : `${getDocsBase(locale.value)}/`
  return hash ? `${basePath}#${hash}` : basePath
}

const results = computed(() => {
  const terms = getQueryTerms(debouncedQuery.value)
  const fullQuery = normalizeSearch(debouncedQuery.value)
  if (!terms.length) return []

  const scoredResults = searchIndex.value
    .map((record) => ({
      record,
      score: scoreRecord(record, terms, fullQuery),
      titleMatch: terms.every((term) => normalizeSearch(record.title).includes(term))
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const pagesWithSectionResults = new Set(
    scoredResults
      .filter((item) => item.record.type === 'section')
      .map((item) => item.record.page.id)
  )

  return scoredResults
    .filter((item) => (
      item.record.type !== 'page' ||
      item.titleMatch ||
      !pagesWithSectionResults.has(item.record.page.id)
    ))
    .slice(0, 10)
    .map(({ record }) => ({
      id: record.id,
      href: resultHref(record.page, record.hash),
      sectionTitle: t(sectionTitleKeys[record.page.section]),
      title: record.type === 'page' ? record.title : `${t(record.page.titleKey)} / ${record.title}`,
      excerptHtml: createHighlightedExcerpt(record.bodyText || record.title, terms)
    }))
})

// 索引按语言隔离：英文页搜中文词（或中文页搜英文词）时无结果，
// 这里给出「换个语言再搜」的提示，而不是干巴巴一句「没有找到」。
const localeSuggestion = computed(() => {
  if (results.value.length) return ''
  const trimmed = debouncedQuery.value.trim()
  if (!trimmed) return ''

  const hasCjk = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(trimmed)
  if (locale.value === 'en' && hasCjk) return 'zh-cn'
  if (locale.value === 'zh-cn' && !hasCjk && /[a-z]/i.test(trimmed)) return 'en'
  return ''
})

const statusText = computed(() => {
  if (!loadedRecords.value[locale.value]) return t('search.loading')
  const trimmedQuery = debouncedQuery.value.trim()
  if (!trimmedQuery) return t('search.empty')
  if (!results.value.length) return t('search.noResults')
  return t('search.results').replace('{count}', String(results.value.length))
})

function openSearch() {
  isOpen.value = true
  ensureIndexLoaded(locale.value)
}

function closeSearch() {
  isOpen.value = false
}

async function switchToOtherLocale() {
  const target = localeSuggestion.value
  if (!target) return

  setLocale(target)
  await ensureIndexLoaded(target)
  router.push(toLocalePath(route.fullPath, target))
}

async function openActiveResult() {
  const result = results.value[activeIndex.value] || results.value[0]
  if (!result) return

  closeSearch()
  await router.push(result.href)
}

// ↑↓ 在结果列表中循环选择
function moveActive(delta) {
  const total = results.value.length
  if (!total) return
  activeIndex.value = (activeIndex.value + delta + total) % total
}

function getPanelFocusables() {
  const panel = panelRef.value
  if (!panel) return []

  return Array.from(panel.querySelectorAll(
    'input, a[href], button, mdui-button-icon, [tabindex]:not([tabindex="-1"])'
  ))
}

// 焦点陷阱：Tab 在对话框内循环，不泄露到背后页面
function trapFocus(event) {
  const focusables = getPanelFocusables()
  if (!focusables.length) return

  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  const current = document.activeElement
  const insidePanel = panelRef.value?.contains(current)

  if (event.shiftKey && (current === first || !insidePanel)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (current === last || !insidePanel)) {
    event.preventDefault()
    first.focus()
  }
}

function onPanelKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeSearch()
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActive(1)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(-1)
    return
  }
  if (event.key === 'Tab') {
    trapFocus(event)
  }
}

watch(query, (value) => {
  lastQuery = value
  if (typeof window === 'undefined') return
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debouncedQuery.value = value
  }, 120)
})

watch(results, () => {
  activeIndex.value = 0
})

watch(activeIndex, async (index) => {
  await nextTick()
  panelRef.value?.querySelector(`#doc-search-option-${index}`)?.scrollIntoView({ block: 'nearest' })
})

// 切换语言时补载另一种语言的索引
watch(locale, (activeLocale) => {
  if (isOpen.value) ensureIndexLoaded(activeLocale)
})

function isTextInput(target) {
  const tagName = target?.tagName?.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || target?.isContentEditable
}

function onKeydown(event) {
  if (event.isComposing) return

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    openSearch()
    return
  }

  if (event.key === '/' && !isTextInput(event.target)) {
    event.preventDefault()
    openSearch()
  }
}

let previouslyFocused = null
let debounceTimer = null

watch(isOpen, async (open) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('doc-search-open', open)
  }

  if (open) {
    previouslyFocused = document.activeElement
    await nextTick()
    if (lastQuery) {
      query.value = lastQuery
      debouncedQuery.value = lastQuery
    }
    inputRef.value?.focus()
  } else {
    // 关闭后把焦点还给触发入口
    previouslyFocused?.focus?.()
    previouslyFocused = null
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  window.clearTimeout(debounceTimer)
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('doc-search-open')
  }
})
</script>

<style scoped>
.search-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:global(html.doc-search-open),
:global(html.doc-search-open body) {
  overflow: hidden;
}

.doc-search-overlay {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: calc(var(--app-bar-height) + 1.5rem) 1.5rem 1.5rem;
  background: #00000052;
}

.doc-search-panel {
  width: min(56rem, 100%);
  max-height: min(78vh, calc(100vh - var(--app-bar-height) - 3rem));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: rgb(var(--mdui-color-surface));
  box-shadow: var(--mdui-elevation-level3);
}

.doc-search-field {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) 3rem;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.125rem 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  color: rgb(var(--mdui-color-on-surface-variant));
}

.doc-search-input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: rgb(var(--mdui-color-on-surface));
  background: transparent;
  font: inherit;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.doc-search-input::placeholder {
  color: rgb(var(--mdui-color-on-surface-variant));
}

.doc-search-close {
  justify-self: end;
}

.doc-search-status {
  padding: 1rem 1.5rem 0.75rem;
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-body-small-size);
  line-height: var(--mdui-typescale-body-small-line-height);
}

.doc-search-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1.5rem 1.25rem;
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-body-small-size);
  line-height: var(--mdui-typescale-body-small-line-height);
}

.doc-search-results {
  overflow: auto;
  padding: 0 1rem 1rem;
}

.doc-search-result {
  display: grid;
  gap: 0.375rem;
  padding: 1rem 1.125rem;
  border-radius: 16px;
  color: inherit;
}

.doc-search-result:hover,
.doc-search-result.is-active,
.doc-search-result:focus-visible {
  outline: 0;
  background: var(--surface-hover);
}

.doc-search-section {
  color: rgb(var(--mdui-color-primary));
  font-size: var(--mdui-typescale-label-medium-size);
  font-weight: var(--mdui-typescale-label-medium-weight);
  line-height: var(--mdui-typescale-label-medium-line-height);
}

.doc-search-title {
  color: rgb(var(--mdui-color-on-surface));
  font-size: var(--mdui-typescale-title-small-size);
  font-weight: var(--mdui-typescale-title-small-weight);
  line-height: var(--mdui-typescale-title-small-line-height);
}

.doc-search-excerpt {
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-body-medium-size);
  line-height: 1.55;
}

.doc-search-excerpt :deep(mark) {
  border-radius: 4px;
  color: rgb(var(--mdui-color-on-primary-container));
  background: rgb(var(--mdui-color-primary-container));
}

@media (max-width: 600px) {
  .doc-search-overlay {
    padding: 0;
  }

  .doc-search-panel {
    width: 100%;
    height: 100vh;
    height: 100dvh;
    max-height: none;
    border: 0;
    border-radius: 0;
  }

  .doc-search-field {
    grid-template-columns: 1.75rem minmax(0, 1fr) 2.75rem;
    gap: 0.5rem;
    padding: 0.75rem 0.75rem 0.75rem 1rem;
  }

  .doc-search-input {
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .doc-search-status {
    padding: 0.875rem 1rem 0.625rem;
  }

  .doc-search-hint {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 1rem 1.25rem;
  }

  .doc-search-results {
    flex: 1;
    padding: 0 0.5rem 0.75rem;
  }

  .doc-search-result {
    border-radius: 12px;
    padding: 0.875rem 0.75rem;
  }
}
</style>
