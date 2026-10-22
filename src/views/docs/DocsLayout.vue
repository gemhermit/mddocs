<template>
  <mdui-layout class="layout" :class="{ 'docs-sidebar-collapsed': isSidebarCollapsed }">
    <AppBar @toggle-drawer="toggleDrawer" />

    <mdui-navigation-drawer
      ref="drawerRef"
      class="drawer"
      :open="drawerOpen"
      close-on-esc
      close-on-overlay-click
      order="2"
      data-nosnippet
      @open="onDrawerOpen"
      @close="onDrawerClose"
      @closed="onDrawerClose"
    >
      <Sidebar @navigate="onNavigate" />
    </mdui-navigation-drawer>

    <mdui-layout-main class="layout-main">
      <div class="main" :class="{ 'docs-sidebar-collapsed': isSidebarCollapsed }">
        <main id="main-content" class="container mdui-prose" tabindex="-1">
          <!-- 窄屏（<1440px）没有右侧目录，这里给一个可折叠的页内目录 -->
          <details v-if="headings.length" ref="inlineTocRef" class="toc-inline">
            <summary class="toc-inline-summary">
              <mdui-icon name="format_list_bulleted--rounded"></mdui-icon>
              <span class="toc-inline-title">{{ t('toc') }}</span>
              <mdui-icon name="expand_more" class="toc-inline-arrow"></mdui-icon>
            </summary>
            <TocList :headings="headings" :active-id="activeId" @select="onTocSelect" />
          </details>
          <router-view />
        </main>
        <div class="contents" v-if="headings.length">
          <div class="title">{{ t('toc') }}</div>
          <TocList :headings="headings" :active-id="activeId" @select="onTocSelect" />
        </div>
      </div>
    </mdui-layout-main>
  </mdui-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import AppBar from '@/components/AppBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import TocList from '@/components/TocList.vue'
import { useI18n } from '@/i18n/index.js'
import { useToc } from '@/composables/toc.js'

const { t } = useI18n()
const { headings: tocHeadings } = useToc()
const drawerRef = ref(null)
const inlineTocRef = ref(null)
const activeId = ref('')
const headingOffset = 96
const desktopMediaQuery = '(min-width: 840px)'
// 右侧目录在 1440px 以上才显示，窄屏折叠目录与之互斥
const wideMediaQuery = '(min-width: 1440px)'

// 标题数据由 MarkdownDoc 在渲染 markdown 时直接产出，TOC 只展示 h2/h3
const headings = computed(() =>
  tocHeadings.value.filter((heading) => heading.id && (heading.level === 2 || heading.level === 3))
)

function isDesktopViewport() {
  return typeof window !== 'undefined' && window.matchMedia(desktopMediaQuery).matches
}

const isDesktop = ref(isDesktopViewport())
const drawerOpen = ref(isDesktop.value)
const isSidebarCollapsed = computed(() => isDesktop.value && !drawerOpen.value)

function toggleDrawer() {
  setDrawerOpen(!drawerOpen.value)
}

function onNavigate() {
  if (!isDesktop.value) {
    setDrawerOpen(false)
  }
}

function setDrawerOpen(open) {
  drawerOpen.value = Boolean(open)

  const drawer = drawerRef.value
  if (drawer && drawer.open !== drawerOpen.value) {
    drawer.open = drawerOpen.value
  }

  syncDrawerScrollLock(drawerOpen.value)
}

function shouldHandleDrawerEvent(event) {
  return !event || event.target === event.currentTarget
}

function onDrawerOpen(event) {
  if (!shouldHandleDrawerEvent(event)) return

  drawerOpen.value = true
  syncDrawerScrollLock(true)
}

function onDrawerClose(event) {
  if (!shouldHandleDrawerEvent(event)) return

  drawerOpen.value = false
  syncDrawerScrollLock(false)
}

function syncDrawerScrollLock(open) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('docs-drawer-open', Boolean(open && !isDesktop.value))
}

function syncDrawerForViewport() {
  isDesktop.value = isDesktopViewport()
  setDrawerOpen(isDesktop.value)
}

// 目录条目是真实锚点，滚动与 URL 里的 #id 都由浏览器原生处理；
// 这里只负责窄屏点完把折叠目录收起来，避免挡住刚滚动到的位置。
function onTocSelect() {
  const details = inlineTocRef.value
  if (!details) return
  const isWide = typeof window !== 'undefined' && window.matchMedia(wideMediaQuery).matches
  if (!isWide) details.open = false
}

// 初始化 / 切页时按当前滚动位置对齐一次高亮（处理带 hash 直达页面中部的情况）
function syncActiveToScroll() {
  let current = headings.value[0]?.id || ''
  for (const heading of headings.value) {
    const el = document.getElementById(heading.id)
    if (el && el.getBoundingClientRect().top <= headingOffset) {
      current = heading.id
    } else {
      break
    }
  }
  if (current) activeId.value = current
}

let spyObserver = null
let viewportMedia = null

// scroll spy：用 IntersectionObserver 监听标题进入阅读区域（顶部 offset 到视口 30% 之间）
function setupScrollSpy() {
  spyObserver?.disconnect()
  spyObserver = null
  if (typeof IntersectionObserver === 'undefined') return

  const targets = headings.value
    .map((heading) => document.getElementById(heading.id))
    .filter(Boolean)
  if (!targets.length) return

  spyObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
    if (!visible.length) return
    const topmost = visible.reduce((a, b) =>
      a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
    )
    activeId.value = topmost.target.id
  }, { rootMargin: `-${headingOffset}px 0px -70% 0px`, threshold: 0 })

  targets.forEach((el) => spyObserver.observe(el))
}

watch(headings, async (list) => {
  activeId.value = list[0]?.id || ''
  await nextTick()
  setupScrollSpy()
  syncActiveToScroll()
}, { immediate: true })

onMounted(() => {
  syncDrawerForViewport()
  viewportMedia = window.matchMedia(desktopMediaQuery)
  viewportMedia.addEventListener('change', syncDrawerForViewport)
})

onUnmounted(() => {
  spyObserver?.disconnect()
  viewportMedia?.removeEventListener('change', syncDrawerForViewport)
  syncDrawerScrollLock(false)
})
</script>
