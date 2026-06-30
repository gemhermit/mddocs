<template>
  <mdui-layout class="layout">
    <AppBar />

    <mdui-layout-main class="layout-main not-found-main">
      <section class="not-found">
        <div class="code">{{ t('notFound.title') }}</div>
        <p class="desc">{{ t('notFound.description') }}</p>
        <div class="actions">
          <mdui-button :href="homePath">
            <mdui-icon slot="icon" name="home--rounded"></mdui-icon>
            {{ t('notFound.backHome') }}
          </mdui-button>
          <mdui-button variant="tonal" :href="docsPath">
            <mdui-icon slot="icon" name="menu_book--rounded"></mdui-icon>
            {{ t('notFound.backDocs') }}
          </mdui-button>
        </div>
      </section>
    </mdui-layout-main>
  </mdui-layout>
</template>

<script setup>
import { computed } from 'vue'
import AppBar from '@/components/AppBar.vue'
import { useI18n } from '@/i18n/index.js'
import { getDocsBase, getLocalePrefix } from '@/utils/site.js'

const { t, locale } = useI18n()
const homePath = computed(() => getLocalePrefix(locale.value) || '/')
const docsPath = computed(() => getDocsBase(locale.value))
</script>

<style scoped>
.not-found-main {
  background: rgb(var(--mdui-color-surface));
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--app-bar-height));
  margin-top: var(--app-bar-height);
  text-align: center;
  padding: 3rem 1.5rem;
}

.code {
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  color: rgb(var(--mdui-color-primary));
}

.desc {
  max-width: 32rem;
  margin: 1.25rem 0 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-title-large-size);
  line-height: 1.6;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

@media (max-width: 640px) {
  .code {
    font-size: 5.5rem;
  }
}
</style>
