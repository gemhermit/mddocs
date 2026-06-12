<template>
  <mdui-tooltip :content="tooltipText">
    <mdui-button-icon @click="cycleTheme">
      <span class="material-icons">{{ icon }}</span>
    </mdui-button-icon>
  </mdui-tooltip>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const theme = ref('auto')
const icon = ref('brightness_auto')
const tooltipText = ref('Theme: Auto')

const themeConfig = {
  auto: { icon: 'brightness_auto', tooltip: 'Theme: Auto', htmlClass: 'mdui-theme-auto', mduiValue: 'auto' },
  light: { icon: 'light_mode', tooltip: 'Theme: Light', htmlClass: 'mdui-theme-light', mduiValue: 'light' },
  dark: { icon: 'dark_mode', tooltip: 'Theme: Dark', htmlClass: 'mdui-theme-dark', mduiValue: 'dark' }
}

const cycleOrder = ['auto', 'light', 'dark']

function applyTheme(t) {
  const html = document.documentElement
  html.classList.remove('mdui-theme-auto', 'mdui-theme-light', 'mdui-theme-dark')
  html.classList.add(themeConfig[t].htmlClass)
  icon.value = themeConfig[t].icon
  tooltipText.value = themeConfig[t].tooltip
  theme.value = t
  if (window.mdui?.setTheme) {
    window.mdui.setTheme(themeConfig[t].mduiValue)
  }
  localStorage.setItem('mdui-theme', t)
}

function cycleTheme() {
  const idx = cycleOrder.indexOf(theme.value)
  const next = cycleOrder[(idx + 1) % cycleOrder.length]
  applyTheme(next)
}

onMounted(() => {
  const saved = localStorage.getItem('mdui-theme')
  if (saved && cycleOrder.includes(saved)) {
    applyTheme(saved)
  } else {
    applyTheme('auto')
  }
})
</script>

<style scoped>
:host {
  display: flex;
  align-items: center;
}
</style>
