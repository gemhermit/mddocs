<template>
  <nav class="docs-sidebar">
    <mdui-collapse :value="openSections" @change="openSections = $event.detail" accordion>
      <mdui-collapse-item
        v-for="section in sections"
        :key="section.titleKey"
        :value="section.value"
      >
        <mdui-list-item slot="header" rounded>
          <span class="material-icons" slot="icon">{{ section.icon }}</span>
          {{ t(section.titleKey) }}
          <span class="material-icons arrow" slot="end-icon" :class="{ active: openSections.includes(section.value) }">expand_more</span>
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

    <div class="sidebar-links">
      <div class="sidebar-links-title">{{ t('sidebar.resources') }}</div>
      <mdui-list>
        <mdui-list-item href="https://github.com/zdhxiong/mdui" target="_blank" rounded>
          GitHub
        </mdui-list-item>
        <mdui-list-item href="https://www.mdui.org/docs/" target="_blank" rounded>
          mdui 1 Docs
        </mdui-list-item>
      </mdui-list>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

const openSections = ref(['getting-started'])

function docHref(path) {
  return path ? `${docsBase.value}/${path}` : `${docsBase.value}/`
}

watch(() => route.path, (path) => {
  for (const section of sections) {
    if (section.items.some(item => item.id === activeDocId.value)) {
      if (!openSections.value.includes(section.value)) {
        openSections.value = [section.value]
      }
      break
    }
  }
}, { immediate: true })
</script>

<style scoped>
.docs-sidebar {
  padding: 0.5rem 0;
}

.sublist {
  padding-left: 0.25rem;
}

.sidebar-links {
  padding: 0.75rem 0.75rem 0;
}

.sidebar-links-title {
  color: var(--text-tertiary);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  padding: 0 0.75rem 0.5rem;
  text-transform: uppercase;
}

.arrow {
  margin-left: auto;
  transition: transform 0.2s;
  opacity: 0.5;
  font-size: 1.25rem !important;
}

.arrow.active {
  transform: rotate(180deg);
}
</style>
