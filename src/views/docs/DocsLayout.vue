<template>
  <mdui-layout class="layout">
    <AppBar @toggle-drawer="toggleDrawer" />

    <mdui-navigation-drawer
      ref="drawerRef"
      class="drawer"
      close-on-esc
      close-on-overlay-click
      order="2"
    >
      <Sidebar @navigate="onNavigate" />
    </mdui-navigation-drawer>

    <mdui-layout-main class="layout-main">
      <div :class="['main', { 'docs-sidebar-collapsed': !desktopSidebarOpen }]">
        <aside :class="['sidebar-panel', { collapsed: !desktopSidebarOpen }]">
          <Sidebar />
        </aside>
        <main class="container mdui-prose">
          <router-view />
        </main>
        <div class="contents" v-if="headings.length">
          <div class="title">{{ t('toc') }}</div>
          <mdui-list class="items">
            <mdui-list-item
              v-for="h in headings"
              :key="h.id"
              :href="'#' + h.id"
              rounded
              :class="[
                'toc-level-' + h.level,
                { active: activeId === h.id }
              ]"
              @click.prevent="scrollTo(h.id)"
            >
              {{ h.text }}
            </mdui-list-item>
          </mdui-list>
        </div>
      </div>
    </mdui-layout-main>
  </mdui-layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import AppBar from '../../components/AppBar.vue'
import Sidebar from '../../components/Sidebar.vue'
import { useI18n } from '../../i18n/index.js'

const DESKTOP_BREAKPOINT = 960
const DESKTOP_SIDEBAR_STORAGE_KEY = 'mdui-docs-desktop-sidebar-open'

const route = useRoute()
const { t } = useI18n()
const drawerRef = ref(null)
const headings = ref([])
const activeId = ref('')
const desktopSidebarOpen = ref(true)

function toggleDrawer() {
  if (typeof window !== 'undefined' && window.innerWidth >= DESKTOP_BREAKPOINT) {
    desktopSidebarOpen.value = !desktopSidebarOpen.value
    localStorage.setItem(DESKTOP_SIDEBAR_STORAGE_KEY, String(desktopSidebarOpen.value))
    return
  }

  const drawer = drawerRef.value
  if (drawer) {
    drawer.open = !drawer.open
  }
}

function onNavigate() {
  const drawer = drawerRef.value
  if (drawer) {
    drawer.open = false
  }
}

function extractHeadings() {
  const content = document.querySelector('.container')
  if (!content) return
  const els = content.querySelectorAll('h2 a, h3 a')
  headings.value = Array.from(els).map(el => ({
    id: el.getAttribute('href')?.replace('#', '') || '',
    text: el.textContent?.trim() || '',
    level: el.closest('h3') ? 3 : 2
  }))
}

function scrollTo(id) {
  // id comes from <a href="#xxx">, find the <a> then scroll to its parent heading
  const anchor = document.querySelector(`a[href="#${id}"]`)
  if (anchor) {
    const heading = anchor.closest('h2, h3')
    if (heading) {
      const rect = heading.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      window.scrollTo({
        top: scrollTop + rect.top - 80,
        behavior: 'smooth'
      })
    }
    activeId.value = id
  }
}

function updateActive() {
  const content = document.querySelector('.container')
  if (!content) return
  const els = content.querySelectorAll('h2 a, h3 a')
  let current = ''
  for (const el of els) {
    const heading = el.closest('h2, h3')
    if (heading && heading.getBoundingClientRect().top <= 120) {
      current = el.getAttribute('href')?.replace('#', '') || ''
    }
  }
  if (current) activeId.value = current
}

let observer = null

function setupObserver() {
  observer?.disconnect()
  const content = document.querySelector('.container')
  if (content) {
    observer = new MutationObserver(() => extractHeadings())
    observer.observe(content, { childList: true, subtree: true })
  }
}

watch(() => route.path, async () => {
  headings.value = []
  activeId.value = ''
  await nextTick()
  setTimeout(() => {
    extractHeadings()
    setupObserver()
  }, 100)
}, { immediate: true })

onMounted(() => {
  if (typeof window !== 'undefined') {
    const storedState = localStorage.getItem(DESKTOP_SIDEBAR_STORAGE_KEY)
    if (storedState !== null) {
      desktopSidebarOpen.value = storedState === 'true'
    }
  }

  extractHeadings()
  setupObserver()
  window.addEventListener('scroll', updateActive, { passive: true })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', updateActive)
})
</script>
