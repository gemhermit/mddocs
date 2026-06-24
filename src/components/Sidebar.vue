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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../i18n/index.js'
import { docsSections, findDocPageByPath } from '../data/docs.js'
import { getDocsBase } from '../utils/site.js'

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

// 默认展开:优先用上次缓存的;没缓存过才回退到"当前 active 所在 section"。
// 注意:即使是 ''(用户上次主动收起),也属于"用户的选择",不要被默认值覆盖。
const openSection = ref(readStoredOpenSection() ?? findSectionForActiveId())

function docHref(path) {
  return path ? `${docsBase.value}/${path}` : `${docsBase.value}/`
}

function toggleSection(value) {
  // 同一个 section 再点一次就收起,这是 accordion 模式该有的行为
  setOpenSection(openSection.value === value ? '' : value)
}

function setOpenSection(value) {
  openSection.value = normalizeOpenSection(value)
  writeStoredOpenSection(openSection.value)
}

function setOpenSectionFromEvent(event) {
  // mdui-collapse 在 accordion 模式下,点击已展开的会 emit value 为空,
  // 点击未展开的会 emit value 为对应 value ——这个行为正是我们要的
  setOpenSection(event.target?.value ?? '')
}
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
