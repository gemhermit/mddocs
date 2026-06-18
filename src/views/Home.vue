<template>
  <mdui-layout class="layout">
    <AppBar />

    <mdui-layout-main class="layout-main">
      <div class="container">
        <h1><em>M</em>aterial <em>D</em>esign <em>U</em>ser <em>I</em>nterface</h1>
        <div class="description">
          {{ t('home.subtitle') }}
        </div>
        <div class="actions">
          <mdui-button class="start" :href="docsPath + '/introduction'">{{ t('home.getStarted') }}</mdui-button>
          <mdui-button class="start" variant="tonal" :href="docsPath + '/installation'">{{ t('home.install') }}</mdui-button>
          <mdui-button variant="text" href="https://github.com/zdhxiong/mdui" target="_blank">
            {{ t('home.github') }}
          </mdui-button>
        </div>
      </div>

      <div class="container mdui-prose">
        <div class="item" v-for="(key, idx) in featureKeys" :key="idx">
          <h2>{{ t('features.' + key + '.title') }}</h2>
          <p>{{ t('features.' + key + '.desc') }}</p>
        </div>
      </div>

      <Footer />
    </mdui-layout-main>
  </mdui-layout>
</template>

<script setup>
import { computed } from 'vue'
import AppBar from '../components/AppBar.vue'
import Footer from '../components/Footer.vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase } from '../utils/site.js'

const { t, locale } = useI18n()
const docsPath = computed(() => getDocsBase(locale.value))

const featureKeys = [
  'webComponents', 'materialYou', 'dynamicColor', 'darkMode',
  'lightweight', 'ideSupport', 'frameworkSupport', 'typescriptSupport',
  'noDependencies', 'richComponents', 'materialIcons', 'easeOfLearning'
]
</script>
