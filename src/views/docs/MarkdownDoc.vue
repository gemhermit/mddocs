<template>
  <div>
    <div v-if="isLoading" class="doc-loading">
      <mdui-circular-progress></mdui-circular-progress>
    </div>
    <div v-else-if="isMissing" class="doc-missing">
      <h1>{{ t('docMissing.title') }}</h1>
      <p>{{ t('docMissing.description') }}</p>
      <mdui-button variant="tonal" :href="pageHref('')">
        <mdui-icon slot="icon" name="menu_book--rounded"></mdui-icon>
        {{ t('docMissing.backDocs') }}
      </mdui-button>
    </div>
    <div v-else ref="contentRef" v-html="html"></div>

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
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n/index.js'
import { docsPages } from '@/data/docs.js'
import { getDocsBase } from '@/utils/site.js'
import { renderMarkdownWithMeta } from '@/utils/markdown.js'
import { sanitizeHtml } from '@/utils/sanitize.js'
import { highlightAll } from '@/utils/highlight.js'
import { useToc } from '@/composables/toc.js'

// 懒加载 Markdown 源文件：每篇文档单独成 chunk，按需拉取
const markdownLoaders = import.meta.glob('/src/content/docs/**/*.md', {
  query: '?raw',
  import: 'default'
})

const docLoaders = Object.entries(markdownLoaders).reduce((result, [filePath, loader]) => {
  const match = filePath.match(/\/content\/docs\/([^/]+)\/(.+)\.md$/)
  if (match) {
    const [, docLocale, docPath] = match
    result[docLocale] ||= {}
    result[docLocale][docPath] = loader
  }
  return result
}, {})

const docCache = new Map()

const route = useRoute()
const { t, locale } = useI18n()
const { setHeadings } = useToc()
const contentRef = ref(null)
const source = ref('')
const isLoading = ref(false)
const isMissing = ref(false)

const docId = computed(() => route.meta?.docId || 'introduction')
const docPath = computed(() => route.meta?.docPath || docId.value)
const rendered = computed(() => renderMarkdownWithMeta(source.value))
const html = computed(() => sanitizeHtml(rendered.value.html))

let loadToken = 0

async function loadDoc(activeLocale, activePath) {
  const token = ++loadToken
  const cacheKey = `${activeLocale}/${activePath}`

  // 命中缓存时同步渲染，避免 loading 闪烁
  if (docCache.has(cacheKey)) {
    source.value = docCache.get(cacheKey)
    isMissing.value = false
    return
  }

  // 文档缺失时给出明确提示，而不是静默白屏
  const loader = docLoaders[activeLocale]?.[activePath]
  if (!loader) {
    source.value = ''
    isMissing.value = true
    return
  }

  isLoading.value = true
  try {
    const content = await loader()
    docCache.set(cacheKey, content)
    // 仅应用最后一次请求的结果，避免快速切页时串内容
    if (token === loadToken) {
      source.value = content
      isMissing.value = false
    }
  } catch {
    if (token === loadToken) {
      source.value = ''
      isMissing.value = true
    }
  } finally {
    if (token === loadToken) isLoading.value = false
  }
}

watch([locale, docPath], ([activeLocale, activePath]) => {
  loadDoc(activeLocale, activePath)
}, { immediate: true })

const pageIndex = computed(() => docsPages.findIndex((page) => page.id === docId.value))
const previousPage = computed(() => pageIndex.value > 0 ? docsPages[pageIndex.value - 1] : null)
const nextPage = computed(() => {
  const index = pageIndex.value
  return index >= 0 && index < docsPages.length - 1 ? docsPages[index + 1] : null
})

function pageHref(path) {
  return path ? `${getDocsBase(locale.value)}/${path}` : `${getDocsBase(locale.value)}/`
}

// 标题元数据在渲染 markdown 时直接产出，响应式交给 DocsLayout 的 TOC
watch(() => rendered.value.headings, (headings) => {
  setHeadings(headings)
}, { immediate: true })

onUnmounted(() => {
  setHeadings([])
})

watch(html, async () => {
  await nextTick()
  if (contentRef.value) highlightAll(contentRef.value, { copyLabel: t('code.copy') })
}, { immediate: true })
</script>

<style scoped>
.doc-loading {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.doc-missing {
  padding: 2rem 0;
}
</style>
