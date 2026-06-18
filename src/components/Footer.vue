<template>
  <div>
    <div class="divider">
      <svg aria-hidden="true" width="100%" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
          <g clip-path="url(#clip0_2426_11367)">
            <path d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0" stroke="#E1E3E1" stroke-linecap="square"></path>
          </g>
        </pattern>
        <rect width="100%" height="100%" fill="url(#a)"></rect>
      </svg>
    </div>

    <footer class="container" data-nosnippet>
      <ul class="links mdui-prose">
        <li class="title">{{ t('footer.community') }}</li>
        <li><a href="https://github.com/zdhxiong/mdui/issues" target="_blank">{{ t('footer.githubIssue') }}</a></li>
      </ul>
      <ul class="links mdui-prose">
        <li class="title">{{ t('footer.resources') }}</li>
        <li><a :href="docsPath">{{ t('nav.mdui2Docs') }}</a></li>
        <li><a href="https://www.mdui.org/docs/" target="_blank">{{ t('nav.mdui1Docs') }}</a></li>
        <li><a href="https://www.mdui.org/design/" target="_blank">{{ t('nav.materialDesign1') }}</a></li>
      </ul>
      <ul class="links mdui-prose">
        <li class="title">{{ t('footer.sponsor') }}</li>
        <li><a href="https://www.paypal.com/paypalme/zdhxiong" target="_blank" rel="nofollow">{{ t('footer.paypal') }}</a></li>
        <li><a href="#" rel="nofollow" @click.prevent="showAlipay = true">{{ t('footer.alipay') }}</a></li>
        <li><a href="#" rel="nofollow" @click.prevent="showWechat = true">{{ t('footer.wechat') }}</a></li>
      </ul>
    </footer>

    <mdui-dialog :open="showAlipay" @closed="showAlipay = false" headline="Donate via Alipay by scanning" close-on-esc close-on-overlay-click class="qrcode-dialog">
      <img src="https://cdn.w3cbus.com/mdui/docs-2/assets/alipay-B4XhXw5Y.jpg" alt="Donate via Alipay by scanning" loading="lazy" class="qrcode-item" width="240" height="297">
    </mdui-dialog>

    <mdui-dialog :open="showWechat" @closed="showWechat = false" headline="Donate via WeChat by scanning" close-on-esc close-on-overlay-click class="qrcode-dialog">
      <img src="https://cdn.w3cbus.com/mdui/docs-2/assets/wechat-BA1BsunO.jpg" alt="Donate via WeChat by scanning" loading="lazy" class="qrcode-item" width="240" height="297">
    </mdui-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase } from '../utils/site.js'

const { t, locale } = useI18n()
const docsPath = computed(() => getDocsBase(locale.value))
const showAlipay = ref(false)
const showWechat = ref(false)
</script>

<style scoped>
.divider {
  width: 100%;
  overflow: hidden;
}

.divider svg {
  display: block;
  width: 100%;
  height: 8px;
}

.links {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  list-style: none;
}

.links li {
  min-width: 120px;
}

.links .title {
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.links a {
  display: block;
  padding: 0.25rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.qrcode-dialog {
  text-align: center;
}

.qrcode-item {
  max-width: 100%;
  border-radius: 0.5rem;
}
</style>
