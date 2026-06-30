<template>
  <div>
    <div ref="contentRef" v-html="html"></div>

    <div class="nav">
      <mdui-card
        v-if="previousPage"
        :href="pageHref(previousPage.path)"
        variant="filled"
        class="card prev"
      >
        <div class="container">
          <div class="overline"><mdui-icon name="west--rounded" class="arrow"></mdui-icon> {{ t('navPrev') }}</div>
          <div class="title">{{ t(previousPage.titleKey) }}</div>
        </div>
      </mdui-card>
      <div v-else class="card prev"></div>

      <mdui-card
        v-if="nextPage"
        :href="pageHref(nextPage.path)"
        variant="filled"
        class="card next"
      >
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">{{ t(nextPage.titleKey) }}</div>
        </div>
      </mdui-card>
      <div v-else class="card next disabled">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">{{ t('comingSoon') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n/index.js'
import { docsPages } from '@/data/docs.js'
import { getDocsBase } from '@/utils/site.js'
import { renderMarkdown } from '@/utils/markdown.js'
import { highlightAll } from '@/utils/highlight.js'

const markdownModules = import.meta.glob('/src/content/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

const docs = Object.entries(markdownModules).reduce((result, [filePath, source]) => {
  const match = filePath.match(/\/content\/docs\/([^/]+)\/(.+)\.md$/)
  if (match) {
    const [, docLocale, docPath] = match
    result[docLocale] ||= {}
    result[docLocale][docPath] = source
  }
  return result
}, {})

const route = useRoute()
const { t, locale } = useI18n()
const contentRef = ref(null)

const docId = computed(() => route.meta?.docId || 'introduction')
const docPath = computed(() => route.meta?.docPath || docId.value)
const html = computed(() => renderMarkdown(docs[locale.value]?.[docPath.value] || ''))

const pageIndex = computed(() => docsPages.findIndex((page) => page.id === docId.value))
const previousPage = computed(() => pageIndex.value > 0 ? docsPages[pageIndex.value - 1] : null)
const nextPage = computed(() => {
  const index = pageIndex.value
  return index >= 0 && index < docsPages.length - 1 ? docsPages[index + 1] : null
})

function pageHref(path) {
  return path ? `${getDocsBase(locale.value)}/${path}` : `${getDocsBase(locale.value)}/`
}

watch(html, async () => {
  await nextTick()
  if (contentRef.value) highlightAll(contentRef.value)
}, { immediate: true })
</script>
