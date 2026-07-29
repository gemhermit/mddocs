<template>
  <mdui-tooltip :content="tooltipText">
    <mdui-button-icon @click="cycleTheme">
      <mdui-icon :name="icon"></mdui-icon>
    </mdui-button-icon>
  </mdui-tooltip>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { setTheme } from 'mdui/functions/setTheme.js'
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
const theme = ref('auto')
const icon = ref('brightness_auto')
// tooltip 跟随当前主题与语言响应式更新
const tooltipText = computed(() => t(`theme.${theme.value}`))

const themeConfig = {
  auto: { icon: 'brightness_auto', htmlClass: 'mdui-theme-auto', mduiValue: 'auto' },
  light: { icon: 'light_mode', htmlClass: 'mdui-theme-light', mduiValue: 'light' },
  dark: { icon: 'dark_mode', htmlClass: 'mdui-theme-dark', mduiValue: 'dark' }
}

const cycleOrder = ['auto', 'light', 'dark']

function applyTheme(name) {
  const html = document.documentElement
  html.classList.remove('mdui-theme-auto', 'mdui-theme-light', 'mdui-theme-dark')
  html.classList.add(themeConfig[name].htmlClass)
  // 与 index.html 内联脚本保持一致，避免切换后系统控件配色不匹配
  html.style.colorScheme = name === 'auto' ? 'light dark' : name
  icon.value = themeConfig[name].icon
  theme.value = name
  setTheme(themeConfig[name].mduiValue)
  try {
    localStorage.setItem('mdui-theme', name)
  } catch {
    // localStorage 不可用时静默降级为内存模式
  }
}

function cycleTheme() {
  const idx = cycleOrder.indexOf(theme.value)
  const next = cycleOrder[(idx + 1) % cycleOrder.length]
  applyTheme(next)
}

onMounted(() => {
  let saved = null
  try {
    saved = localStorage.getItem('mdui-theme')
  } catch {
    // localStorage 不可用时使用默认主题
  }
  if (saved && cycleOrder.includes(saved)) {
    applyTheme(saved)
  } else {
    applyTheme('auto')
  }
})
</script>
