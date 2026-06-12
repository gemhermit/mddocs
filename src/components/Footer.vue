<template>
  <footer class="site-footer">
    <ul class="footer-links">
      <li>
        <div class="title">{{ t('footer.community') }}</div>
        <a href="https://github.com/zdhxiong/mdui/issues" target="_blank">{{ t('footer.githubIssue') }}</a>
      </li>
      <li>
        <div class="title">{{ t('footer.resources') }}</div>
        <a :href="docsPath">mdui 2 {{ t('nav.docs') }}</a>
        <a href="https://www.mdui.org/docs/" target="_blank">mdui 1 {{ t('nav.docs') }}</a>
        <a href="https://www.mdui.org/design/" target="_blank">Material Design 1</a>
      </li>
      <li>
        <div class="title">{{ t('footer.sponsor') }}</div>
        <a href="https://www.paypal.com/paypalme/zdhxiong" target="_blank" rel="nofollow">{{ t('footer.paypal') }}</a>
        <a href="#" rel="nofollow">{{ t('footer.alipay') }}</a>
        <a href="#" rel="nofollow">{{ t('footer.wechat') }}</a>
      </li>
    </ul>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase } from '../utils/site.js'

const { t, locale } = useI18n()
const docsPath = computed(() => getDocsBase(locale.value))
</script>
