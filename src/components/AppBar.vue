<template>
  <mdui-top-app-bar class="appbar" scroll-behavior="elevate" :order="isDocs ? 1 : undefined" data-nosnippet>
    <mdui-button-icon v-if="isDocs" class="docs-menu-toggle" @click="$emit('toggle-drawer')">
      <mdui-icon name="menu--rounded"></mdui-icon>
    </mdui-button-icon>

    <mdui-top-app-bar-title>
      <a :href="homePath" class="title">MDUI</a>
      <a v-if="isDocs" :href="docsBase" class="title small">{{ t('nav.docs') }}</a>
    </mdui-top-app-bar-title>

    <mdui-dropdown v-if="!isDocs" trigger="click">
      <mdui-button class="action dropdown-trigger" slot="trigger" variant="text" end-icon="arrow_drop_down">
        {{ t('nav.docs') }}
      </mdui-button>
      <mdui-menu>
        <mdui-menu-item :href="docsBase">{{ t('nav.mdui2Docs') }}</mdui-menu-item>
        <mdui-menu-item href="https://www.mdui.org/docs/" target="_blank">{{ t('nav.mdui1Docs') }}</mdui-menu-item>
        <mdui-divider></mdui-divider>
        <mdui-menu-item href="https://www.mdui.org/design/" target="_blank">{{ t('nav.materialDesign1') }}</mdui-menu-item>
      </mdui-menu>
    </mdui-dropdown>

    <div class="ai-menu-wrapper">
      <mdui-dropdown>
        <div slot="trigger">
          <mdui-tooltip :content="t('ai.tooltip')">
            <mdui-button-icon icon="auto_awesome"></mdui-button-icon>
          </mdui-tooltip>
        </div>
        <mdui-menu style="max-width:18rem;">
          <mdui-menu-item @click="copyText(llmsTxtUrl)">{{ t('ai.copyLlmsTxt') }}</mdui-menu-item>
          <mdui-menu-item @click="copyText(llmsFullTxtUrl)">{{ t('ai.copyLlmsFullTxt') }}</mdui-menu-item>
          <mdui-menu-item v-if="currentMarkdownUrl" :href="currentMarkdownUrl" target="_blank">
            {{ t('ai.viewAsMarkdown') }}
          </mdui-menu-item>
          <mdui-divider></mdui-divider>
          <mdui-menu-item v-if="currentPageDiscussUrl" :href="currentPageDiscussUrl" target="_blank">
            {{ t('ai.discussPageChatgpt') }}
          </mdui-menu-item>
          <mdui-menu-item :href="chatgptDiscussUrl" target="_blank">
            {{ t('ai.discussChatgpt') }}
          </mdui-menu-item>
        </mdui-menu>
      </mdui-dropdown>
    </div>

    <div class="control">
      <LangSelect />
    </div>

    <mdui-button-icon href="https://github.com/zdhxiong/mdui" target="_blank">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    </mdui-button-icon>

    <div class="control">
      <ThemeSelect />
    </div>
  </mdui-top-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ThemeSelect from './ThemeSelect.vue'
import LangSelect from './LangSelect.vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase, getLocalePrefix } from '../utils/site.js'

defineEmits(['toggle-drawer'])
const route = useRoute()
const { t, locale } = useI18n()

const isDocs = computed(() => route.path.includes('/docs'))
const homePath = computed(() => getLocalePrefix(locale.value) || '/')
const docsBase = computed(() => getDocsBase(locale.value))

const localePrefix = computed(() => locale.value === 'zh-cn' ? 'zh-cn' : 'en')

const llmsBase = computed(() => `https://www.mdui.org/${localePrefix.value}/docs/2`)
const llmsTxtUrl = computed(() => `${llmsBase.value}/llms.txt`)
const llmsFullTxtUrl = computed(() => `${llmsBase.value}/llms-full.txt`)

const currentDocPath = computed(() => {
  const path = route.path
  const match = path.match(/\/docs\/2\/(.*)/)
  return match ? match[1] : ''
})

const currentMarkdownUrl = computed(() => {
  if (!currentDocPath.value && !route.path.match(/\/docs\/2\/?$/)) return ''
  const mdPath = currentDocPath.value ? `${currentDocPath.value}.md` : 'index.md'
  return `https://www.mdui.org/${localePrefix.value}/docs/2/${mdPath}`
})

const currentPageDiscussUrl = computed(() => {
  if (!currentMarkdownUrl.value) return ''
  return `https://chat.openai.com/?q=${encodeURIComponent(`Read ${currentMarkdownUrl.value} and answer questions about the content.`)}`
})

const chatgptDiscussUrl = computed(() =>
  `https://chat.openai.com/?q=${encodeURIComponent(`Read ${llmsFullTxtUrl.value} and answer questions about the content.`)}`
)

function copyText(text) {
  navigator.clipboard?.writeText(text)
}
</script>

<style scoped>
.appbar {
  position: fixed !important;
  top: 0;
  right: 0;
  left: 0;
  height: var(--app-bar-height);
  min-height: var(--app-bar-height);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.75rem;
  z-index: 2000;
}

.appbar > * {
  align-self: center;
}

.appbar :deep(mdui-top-app-bar-title) {
  height: var(--app-bar-height);
  display: flex;
  align-items: center;
}

.appbar :deep(.title) {
  display: inline-flex;
  align-items: center;
  height: var(--app-bar-height);
}

.appbar :deep(mdui-button),
.appbar :deep(mdui-button-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.docs-menu-toggle {
  margin: 0 0.25rem;
}

.ai-menu-wrapper {
  display: flex;
  align-items: center;
}

.ai-menu-wrapper :deep(mdui-dropdown) {
  display: flex;
  align-items: center;
}

.appbar :deep(mdui-tooltip) {
  display: flex;
  align-items: center;
}

.appbar :deep(mdui-dropdown) {
  display: flex;
  align-items: center;
}

.action {
  display: flex;
  align-items: center;
}

.control {
  display: flex;
  align-items: center;
}

@media (max-width: 720px) {
  .dropdown-trigger {
    display: none;
  }
}
</style>
