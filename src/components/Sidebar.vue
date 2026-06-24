<template>
  <mdui-list class="list">
    <mdui-collapse
      :value="openSection"
      accordion
      @change="setOpenSectionFromEvent"
    >
      <mdui-collapse-item
        v-for="section in sections"
        :key="section.value"
        :value="section.value"
      >
        <mdui-list-item slot="header" rounded>
          <mdui-icon slot="icon" :name="section.icon"></mdui-icon>
          {{ t(section.titleKey) }}
          <mdui-icon
            slot="end-icon"
            name="expand_more"
            class="arrow"
            :class="{ 'arrow-active': openSection === section.value }"
          ></mdui-icon>
        </mdui-list-item>
        <div class="sublist">
          <mdui-list-item
            v-for="item in section.items"
            :key="item.id"
            rounded
            :active="activeDocId === item.id"
            :href="docHref(item.path)"
            @click="$emit('navigate')"
          >
            {{ t(item.titleKey) }}
          </mdui-list-item>
        </div>
      </mdui-collapse-item>
    </mdui-collapse>
  </mdui-list>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/i18n/index.js'
import { docsSections, findDocPageByPath } from '@/data/docs.js'
import { getDocsBase } from '@/utils/site.js'

defineEmits(['navigate'])
const route = useRoute()
const { t, locale } = useI18n()

const sections = docsSections
const docsBase = computed(() => getDocsBase(locale.value))
const activeDocId = computed(() => findDocPageByPath(route.path)?.id || 'introduction')

const openSectionStorageKey = 'mdui-docs-sidebar-open-section'
const legacyOpenSectionsStorageKey = 'mdui-docs-sidebar-open-sections'

function normalizeOpenSection(value) {
  const sectionValue = Array.isArray(value) ? value[0] : value
  return sections.some((section) => section.value === sectionValue) ? sectionValue : ''
}

function readStoredOpenSection() {
  if (typeof localStorage === 'undefined') return null

  try {
    let stored = localStorage.getItem(openSectionStorageKey)

    if (stored === null) {
      stored = localStorage.getItem(legacyOpenSectionsStorageKey)
    }

    if (stored === null) return null

    return normalizeOpenSection(JSON.parse(stored))
  } catch {
    return null
  }
}

function writeStoredOpenSection(value) {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(openSectionStorageKey, JSON.stringify(normalizeOpenSection(value)))
}

function findSectionForActiveId() {
  for (const section of sections) {
    if (section.items.some((item) => item.id === activeDocId.value)) {
      return section.value
    }
  }
  return ''
}

const activeSection = computed(() => findSectionForActiveId())

// 当前页面所在章节优先展开,避免缓存停在其它大章节时隐藏 active 项。
const openSection = ref(activeSection.value || readStoredOpenSection() || '')

function docHref(path) {
  return path ? `${docsBase.value}/${path}` : `${docsBase.value}/`
}

function setOpenSection(value, persist = true) {
  openSection.value = normalizeOpenSection(value)
  if (persist) {
    writeStoredOpenSection(openSection.value)
  }
}

function setOpenSectionFromEvent(event) {
  if (event.target !== event.currentTarget) return

  // mdui-collapse 在 accordion 模式下,点击已展开的会 emit value 为空,
  // 点击未展开的会 emit value 为对应 value ——这个行为正是我们要的
  setOpenSection(event.currentTarget?.value ?? '')
}

watch(activeSection, (section) => {
  if (section && openSection.value !== section) {
    setOpenSection(section)
  }
})
</script>

<style scoped>
.arrow {
  margin-left: auto;
  transition: transform 0.2s;
}

.arrow-active {
  transform: rotate(180deg);
}

.sublist {
  margin-left: 2.5rem;
}
</style>
