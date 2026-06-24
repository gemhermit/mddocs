<template>
  <mdui-tooltip :content="t('search.tooltip')">
    <mdui-button-icon class="search-trigger" :aria-label="t('search.tooltip')" @click="openSearch">
      <mdui-icon name="search--rounded"></mdui-icon>
    </mdui-button-icon>
  </mdui-tooltip>

  <Teleport to="body">
    <div v-if="isOpen" class="doc-search-overlay" @click.self="closeSearch">
      <section class="doc-search-panel" role="dialog" aria-modal="true" :aria-label="t('search.title')">
        <div class="doc-search-field">
          <mdui-icon name="search--rounded"></mdui-icon>
          <input
            ref="inputRef"
            v-model="query"
            class="doc-search-input"
            type="search"
            :placeholder="t('search.placeholder')"
            @keydown.enter.prevent="openFirstResult"
            @keydown.esc.prevent="closeSearch"
          >
          <mdui-button-icon class="doc-search-close" :aria-label="t('search.close')" @click="closeSearch">
            <mdui-icon name="close--rounded"></mdui-icon>
          </mdui-button-icon>
        </div>

        <div class="doc-search-status">{{ statusText }}</div>

        <div v-if="results.length" class="doc-search-results">
          <a
            v-for="result in results"
            :key="result.id"
            class="doc-search-result"
            :href="result.href"
            @click="closeSearch"
          >
            <span class="doc-search-section">{{ result.sectionTitle }}</span>
            <span class="doc-search-title">{{ result.title }}</span>
            <span class="doc-search-excerpt" v-html="result.excerptHtml"></span>
          </a>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { docsPages, docsSections } from '@/data/docs.js'
import { useI18n } from '@/i18n/index.js'
import { getDocsBase } from '@/utils/site.js'

const markdownModules = import.meta.glob('/src/content/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const docsByLocale = Object.entries(markdownModules).reduce((result, [filePath, source]) => {
  const match = filePath.match(/\/content\/docs\/([^/]+)\/(.+)\.md$/)
  if (match) {
    const [, docLocale, docPath] = match
    result[docLocale] ||= {}
    result[docLocale][docPath] = source
  }
  return result
}, {})

const router = useRouter()
const { t, locale } = useI18n()
const isOpen = ref(false)
const query = ref('')
const inputRef = ref(null)

const sectionTitleKeys = docsSections.reduce((result, section) => {
  result[section.value] = section.titleKey
  return result
}, {})

function stripHeadingAnchor(value = '') {
  return value.replace(/\s*\{#[A-Za-z0-9_-]+\}\s*$/, '').trim()
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

function headingIdFromLine(rawHeading = '', fallback = 'heading') {
  const explicitId = rawHeading.match(/\s*\{#([A-Za-z0-9_-]+)\}\s*$/)?.[1]
  return explicitId || slugify(stripHeadingAnchor(rawHeading)) || fallback
}

function stripMarkdown(source = '') {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/\s*\{#[A-Za-z0-9_-]+\}\s*/g, ' ')
    .replace(/^[\s>*-]*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/[|*_~>#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function normalizeSearch(value = '') {
  return String(value).toLocaleLowerCase().replace(/\s+/g, ' ').trim()
}

function getQueryTerms(value = '') {
  return normalizeSearch(value).split(' ').filter(Boolean)
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeRegExp(value = '') {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

function getHeadingIds(source = '') {
  const seen = new Map()
  const ids = new Map()

  source.split(/\r?\n/).forEach((line, index) => {
    const match = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*$/)
    if (!match) return

    const baseId = headingIdFromLine(match[2], `heading-${index}`)
    const count = seen.get(baseId) || 0
    seen.set(baseId, count + 1)
    ids.set(index, count > 0 ? `${baseId}-${count + 1}` : baseId)
  })

  return ids
}

function getSectionRecords(source = '', page) {
  const lines = source.split(/\r?\n/)
  const headingIds = getHeadingIds(source)
  const sections = []
  let current = null

  lines.forEach((line, index) => {
    const match = line.match(/^\s{0,3}(#{2,3})\s+(.+?)\s*$/)
    if (match) {
      if (current) sections.push(current)
      current = {
        id: headingIds.get(index) || headingIdFromLine(match[2], `section-${index}`),
        heading: stripHeadingAnchor(match[2]),
        body: []
      }
      return
    }

    if (current) {
      current.body.push(line)
    }
  })

  if (current) sections.push(current)

  return sections.map((section, index) => {
    const bodyText = stripMarkdown(section.body.join('\n'))
    return {
      id: `${page.id}-${section.id || index}`,
      type: 'section',
      page,
      hash: section.id,
      title: section.heading,
      bodyText,
      searchText: normalizeSearch(`${section.heading} ${bodyText}`)
    }
  })
}

const searchIndex = computed(() => {
  const activeLocale = locale.value
  const docs = docsByLocale[activeLocale] || {}

  return docsPages.flatMap((page) => {
    const source = docs[page.path || 'introduction'] || ''
    const pageTitle = t(page.titleKey)
    const bodyText = stripMarkdown(source)
    const pageRecord = {
      id: `${page.id}-page`,
      type: 'page',
      page,
      hash: '',
      title: pageTitle,
      bodyText,
      searchText: normalizeSearch(`${pageTitle} ${bodyText}`)
    }

    return [pageRecord, ...getSectionRecords(source, page)]
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
  const terms = getQueryTerms(query.value)
  const fullQuery = normalizeSearch(query.value)
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

const statusText = computed(() => {
  const trimmedQuery = query.value.trim()
  if (!trimmedQuery) return t('search.empty')
  if (!results.value.length) return t('search.noResults')
  return t('search.results').replace('{count}', String(results.value.length))
})

function openSearch() {
  isOpen.value = true
}

function closeSearch() {
  isOpen.value = false
}

async function openFirstResult() {
  const firstResult = results.value[0]
  if (!firstResult) return

  closeSearch()
  await router.push(firstResult.href)
}

function isTextInput(target) {
  const tagName = target?.tagName?.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || target?.isContentEditable
}

function onKeydown(event) {
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

watch(isOpen, async (open) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('doc-search-open', open)
  }

  if (open) {
    await nextTick()
    inputRef.value?.focus()
  }
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
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
  background: rgba(0, 0, 0, 0.32);
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
