<template>
  <mdui-layout class="layout">
    <AppBar />

    <mdui-layout-main class="layout-main">
      <div class="home-hero">
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

      <div class="features-grid">
        <div class="feature-card" v-for="(key, idx) in featureKeys" :key="idx">
          <h2>{{ t('features.' + key + '.title') }}</h2>
          <p>{{ t('features.' + key + '.desc') }}</p>
        </div>
      </div>

      <div class="home-divider">
        <svg aria-hidden="true" width="100%" height="8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="a" width="91" height="8" patternUnits="userSpaceOnUse">
            <g clip-path="url(#clip0_2426_11367)">
              <path d="M114 4c-5.067 4.667-10.133 4.667-15.2 0S88.667-.667 83.6 4 73.467 8.667 68.4 4 58.267-.667 53.2 4 43.067 8.667 38 4 27.867-.667 22.8 4 12.667 8.667 7.6 4-2.533-.667-7.6 4s-10.133 4.667-15.2 0S-32.933-.667-38 4s-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133-4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0-10.133 4.667-15.2 0" stroke="#E1E3E1" stroke-linecap="square"></path>
            </g>
          </pattern>
          <rect width="100%" height="100%" fill="url(#a)"></rect>
        </svg>
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
