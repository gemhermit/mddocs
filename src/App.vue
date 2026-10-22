<template>
  <a class="skip-link" href="#main-content">{{ t('a11y.skipToContent') }}</a>
  <router-view />
</template>

<script setup>
import { useI18n } from '@/i18n/index.js'

const { t } = useI18n()
</script>

<style>
/* 锚点定位时给吸顶 AppBar 让出高度，章节链接直达时标题不会被遮住 */
:where(h1, h2, h3, h4, h5, h6),
#main-content {
  scroll-margin-top: calc(var(--app-bar-height) + 1.5rem);
}

/* 跳到正文：键盘用户按 Tab 时才出现 */
.skip-link {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 4000;
  padding: 0.625rem 1.125rem;
  border-radius: 14px;
  color: rgb(var(--mdui-color-on-primary));
  background: rgb(var(--mdui-color-primary));
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transform: translateY(calc(-100% - 1.5rem));
  transition: transform 0.2s ease;
}

.skip-link:focus {
  outline: 0;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .skip-link {
    transition: none;
  }
}
</style>
