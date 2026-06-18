<template>
  <mdui-layout class="layout">
    <AppBar @toggle-drawer="toggleDrawer" />

    <mdui-navigation-drawer
      ref="drawerRef"
      class="drawer"
      close-on-esc
      close-on-overlay-click
      order="2"
      data-nosnippet
      @open="syncDrawerScrollLock(true)"
      @close="syncDrawerScrollLock(false)"
      @closed="syncDrawerScrollLock(false)"
    >
      <Sidebar @navigate="onNavigate" />
    </mdui-navigation-drawer>

    <mdui-layout-main class="layout-main">
      <div class="main">
        <main class="container mdui-prose">
          <router-view />
        </main>
        <div class="contents" v-if="headings.length">
          <div class="title">{{ t('toc') }}</div>
          <mdui-list class="items">
            <template v-for="(h, index) in headings" :key="h.id">
              <div v-if="index > 0 && h.level === 2" class="divider"></div>
              <mdui-list-item
                :href="'#' + h.id"
                rounded
                alignment="center"
                :active="activeId === h.id"
                :class="[
                  'item',
                  'toc-level-' + h.level,
                  { 'item-bold': h.level === 2, active: activeId === h.id }
                ]"
                @click.prevent="scrollTo(h.id)"
              >
                {{ h.text }}
              </mdui-list-item>
            </template>
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

const route = useRoute()
const { t } = useI18n()
const drawerRef = ref(null)
const headings = ref([])
const activeId = ref('')
const headingOffset = 96

function toggleDrawer() {
  const drawer = drawerRef.value
  if (drawer) {
    drawer.open = !drawer.open
    syncDrawerScrollLock(drawer.open)
  }
}

function onNavigate() {
  const drawer = drawerRef.value
  if (drawer) {
    drawer.open = false
    syncDrawerScrollLock(false)
  }
}

function syncDrawerScrollLock(open) {
  if (typeof document === 'undefined') return
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 840
  document.documentElement.classList.toggle('docs-drawer-open', Boolean(open && isMobile))
}

function extractHeadings() {
  const content = document.querySelector('.container')
  if (!content) return
  const els = content.querySelectorAll('h2[id], h3[id]')
  headings.value = Array.from(els).map(el => ({
    id: el.id,
    text: el.textContent?.trim() || '',
    level: el.tagName.toLowerCase() === 'h3' ? 3 : 2
  })).filter((heading) => heading.id)
  if (!activeId.value && headings.value.length) {
    activeId.value = headings.value[0].id
  }
}

function scrollTo(id) {
  const heading = document.getElementById(id)
  if (heading) {
    const rect = heading.getBoundingClientRect()
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    window.scrollTo({
      top: scrollTop + rect.top - headingOffset,
      behavior: 'smooth'
    })
    activeId.value = id
  }
}

function updateActive() {
  const content = document.querySelector('.container')
  if (!content) return
  const els = Array.from(content.querySelectorAll('h2[id], h3[id]'))
  let current = headings.value[0]?.id || ''

  for (const heading of els) {
    if (heading.getBoundingClientRect().top <= headingOffset) {
      current = heading.id || current
    } else {
      break
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
    updateActive()
  }, 100)
}, { immediate: true })

onMounted(() => {
  extractHeadings()
  setupObserver()
  window.addEventListener('scroll', updateActive, { passive: true })
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', updateActive)
  syncDrawerScrollLock(false)
})
</script>
