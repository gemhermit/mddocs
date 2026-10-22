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
    <div v-else ref="contentRef" class="markdown-body" v-html="html"></div>

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
import { enhanceCodeBlocks } from '@/utils/code-copy.js'
import { useToc } from '@/composables/toc.js'

// 正文在构建期已渲染成 HTML 并完成消毒，这里按需加载对应页面模块。
// 浏览器端因此不需要 markdown-it / dompurify / highlight.js。
const pageLoaders = import.meta.glob('/src/content/generated/pages/**/*.js')

const pageModules = Object.entries(pageLoaders).reduce((result, [filePath, loader]) => {
  const match = filePath.match(/\/content\/generated\/pages\/([^/]+)\/(.+)\.js$/)
  if (match) {
    const [, docLocale, docPath] = match
    result[docLocale] ||= {}
    result[docLocale][docPath] = loader
  }
  return result
}, {})

const route = useRoute()
const { t, locale } = useI18n()
const { setHeadings } = useToc()
const contentRef = ref(null)
const html = ref('')
const isLoading = ref(false)
const isMissing = ref(false)

const docId = computed(() => route.meta?.docId || 'introduction')
const docPath = computed(() => route.meta?.docPath || docId.value)

const docCache = new Map()
let loadToken = 0

async function loadDoc(activeLocale, activePath) {
  const token = ++loadToken
  const cacheKey = `${activeLocale}/${activePath}`

  // 命中缓存时同步渲染，避免 loading 闪烁
  if (docCache.has(cacheKey)) {
    applyModule(docCache.get(cacheKey))
    return
  }

  const loader = pageModules[activeLocale]?.[activePath]
  if (!loader) {
    html.value = ''
    isMissing.value = true
    setHeadings([])
    return
  }

  isLoading.value = true
  try {
    const module = await loader()
    docCache.set(cacheKey, module)
    // 仅应用最后一次请求的结果，避免快速切页时串内容
    if (token === loadToken) {
      applyModule(module)
    }
  } catch {
    if (token === loadToken) {
      html.value = ''
      isMissing.value = true
      setHeadings([])
    }
  } finally {
    if (token === loadToken) isLoading.value = false
  }
}

function applyModule(module) {
  html.value = module?.html || ''
  isMissing.value = false
  setHeadings(module?.headings || [])
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
  return path ? `${getDocsBase(locale.value)}/${path}` : `${getDocsBase(locale.value)}`
}

// 代码块的复制按钮在正文渲染后挂上
watch(html, async () => {
  await nextTick()
  if (contentRef.value) enhanceCodeBlocks(contentRef.value, { copyLabel: t('code.copy') })
}, { immediate: true })

onUnmounted(() => {
  setHeadings([])
})
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
