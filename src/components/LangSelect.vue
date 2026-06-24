<template>
  <mdui-tooltip :content="locale === 'en' ? '中文' : 'English'">
    <mdui-button-icon @click="handleToggle">
      <span class="lang-text">{{ locale === 'en' ? 'EN' : '中' }}</span>
    </mdui-button-icon>
  </mdui-tooltip>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from '@/i18n/index.js'
import { toLocalePath } from '@/utils/site.js'

const router = useRouter()
const route = useRoute()
const { locale, setLocale } = useI18n()

function handleToggle() {
  const newLocale = locale.value === 'en' ? 'zh-cn' : 'en'
  setLocale(newLocale)
  router.push(toLocalePath(route.fullPath, newLocale))
}
</script>

<style scoped>
.lang-text {
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Roboto', sans-serif;
}
</style>
