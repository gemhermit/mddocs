<template>
  <mdui-list class="list">
    <mdui-collapse :value="openSections" @change="openSections = $event.detail" accordion>
      <mdui-collapse-item
        v-for="section in sections"
        :key="section.value"
        :value="section.value"
      >
        <mdui-list-item slot="header" rounded>
          <mdui-icon slot="icon" :name="section.icon"></mdui-icon>
          {{ t(section.titleKey) }}
          <mdui-icon slot="end-icon" name="expand_more" class="arrow" :class="{ 'arrow-active': openSections.includes(section.value) }"></mdui-icon>
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

watch(() => route.path, () => {
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
