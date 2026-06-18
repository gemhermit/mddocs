<template>
  <mdui-layout class="layout">
    <AppBar />

    <mdui-layout-main class="layout-main home-main">
      <section class="home-hero">
        <div class="hero-copy">
          <div class="eyebrow">{{ t('home.eyebrow') }}</div>
          <h1>{{ t('home.title') }}</h1>
          <p class="lead">{{ t('home.subtitle') }}</p>

          <div class="actions">
            <mdui-button :href="docsPath + '/'">
              <mdui-icon slot="icon" name="near_me--rounded"></mdui-icon>
              {{ t('home.getStarted') }}
            </mdui-button>
            <mdui-button variant="tonal" :href="docsPath + '/getting-started/installation'">
              <mdui-icon slot="icon" name="download--rounded"></mdui-icon>
              {{ t('home.install') }}
            </mdui-button>
          </div>
        </div>

        <mdui-card class="quickstart-card" variant="filled">
          <div class="card-header">
            <mdui-icon name="terminal--rounded"></mdui-icon>
            <span>{{ t('home.quickstartTitle') }}</span>
          </div>
          <p>{{ t('home.quickstartDesc') }}</p>
          <pre><code>git clone https://github.com/gemhermit/mddocs.git
cd mddocs
npm install
npm run dev</code></pre>
          <mdui-button variant="text" :href="docsPath + '/getting-started/usage'">
            {{ t('home.quickstartAction') }}
            <mdui-icon slot="end-icon" name="arrow_forward--rounded"></mdui-icon>
          </mdui-button>
        </mdui-card>
      </section>

      <section class="home-section">
        <div class="section-heading">
          <h2>{{ t('home.docsTitle') }}</h2>
          <p>{{ t('home.docsDesc') }}</p>
        </div>

        <div class="doc-grid">
          <mdui-card
            v-for="card in docCards"
            :key="card.titleKey"
            :href="card.href"
            class="doc-card"
            variant="filled"
          >
            <mdui-icon :name="card.icon"></mdui-icon>
            <h3>{{ t(card.titleKey) }}</h3>
            <p>{{ t(card.descKey) }}</p>
          </mdui-card>
        </div>
      </section>

      <section class="home-section feature-section">
        <div class="section-heading">
          <h2>{{ t('home.featuresTitle') }}</h2>
          <p>{{ t('home.featuresDesc') }}</p>
        </div>

        <div class="feature-grid">
          <div class="feature-item" v-for="feature in featureCards" :key="feature.titleKey">
            <mdui-icon :name="feature.icon"></mdui-icon>
            <div>
              <h3>{{ t(feature.titleKey) }}</h3>
              <p>{{ t(feature.descKey) }}</p>
            </div>
          </div>
        </div>

        <div class="resource-actions">
          <mdui-button variant="text" href="https://github.com/gemhermit/mddocs" target="_blank">
            <mdui-icon slot="icon" name="code--rounded"></mdui-icon>
            {{ t('home.github') }}
          </mdui-button>
        </div>
      </section>

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

const docCards = computed(() => [
  {
    icon: 'explore--rounded',
    titleKey: 'home.cards.overview.title',
    descKey: 'home.cards.overview.desc',
    href: `${docsPath.value}/`
  },
  {
    icon: 'download--rounded',
    titleKey: 'home.cards.installation.title',
    descKey: 'home.cards.installation.desc',
    href: `${docsPath.value}/getting-started/installation`
  },
  {
    icon: 'rocket_launch--rounded',
    titleKey: 'home.cards.usage.title',
    descKey: 'home.cards.usage.desc',
    href: `${docsPath.value}/getting-started/usage`
  }
])

const featureCards = [
  {
    icon: 'article--rounded',
    titleKey: 'features.markdownContent.title',
    descKey: 'features.markdownContent.desc'
  },
  {
    icon: 'account_tree--rounded',
    titleKey: 'features.docsNavigation.title',
    descKey: 'features.docsNavigation.desc'
  },
  {
    icon: 'translate--rounded',
    titleKey: 'features.localization.title',
    descKey: 'features.localization.desc'
  },
  {
    icon: 'content_copy--rounded',
    titleKey: 'features.codeExperience.title',
    descKey: 'features.codeExperience.desc'
  }
]
</script>

<style scoped>
.home-main {
  background: rgb(var(--mdui-color-surface));
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 25rem);
  align-items: center;
  gap: 3rem;
  width: min(100% - 3rem, 72rem);
  min-height: calc(100vh - var(--app-bar-height) - 7rem);
  margin: 0 auto;
  padding: 4rem 0 3rem;
}

.hero-copy {
  min-width: 0;
}

.eyebrow {
  margin-bottom: 1rem;
  color: rgb(var(--mdui-color-primary));
  font-size: var(--mdui-typescale-title-medium-size);
  font-weight: var(--mdui-typescale-title-medium-weight);
  letter-spacing: var(--mdui-typescale-title-medium-tracking);
  line-height: var(--mdui-typescale-title-medium-line-height);
}

.hero-copy h1 {
  max-width: 48rem;
  margin: 0;
  color: rgb(var(--mdui-color-on-surface));
  font-size: 5rem;
  font-weight: 400;
  line-height: 1.05;
}

.lead {
  max-width: 40rem;
  margin: 1.5rem 0 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-title-large-size);
  font-weight: var(--mdui-typescale-title-large-weight);
  letter-spacing: var(--mdui-typescale-title-large-tracking);
  line-height: 1.55;
}

.actions,
.resource-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.quickstart-card {
  padding: 1.25rem;
  border-radius: var(--mdui-shape-corner-large);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgb(var(--mdui-color-on-surface));
  font-size: var(--mdui-typescale-title-medium-size);
  font-weight: var(--mdui-typescale-title-medium-weight);
  letter-spacing: var(--mdui-typescale-title-medium-tracking);
  line-height: var(--mdui-typescale-title-medium-line-height);
}

.quickstart-card p {
  margin: 1rem 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  line-height: 1.7;
}

.quickstart-card pre {
  margin: 0 0 0.75rem;
  padding: 1rem;
  overflow-x: auto;
  border-radius: var(--mdui-shape-corner-small);
  background: rgb(var(--mdui-color-surface-container));
}

.quickstart-card code {
  font-family: Consolas, Courier, 'Courier New', monospace;
  font-size: 0.9375rem;
}

.home-section {
  width: min(100% - 3rem, 72rem);
  margin: 0 auto;
  padding: 3rem 0;
}

.section-heading {
  max-width: 42rem;
  margin-bottom: 1.5rem;
}

.section-heading h2 {
  margin: 0;
  color: rgb(var(--mdui-color-on-surface));
  font-size: var(--mdui-typescale-headline-medium-size);
  font-weight: var(--mdui-typescale-headline-medium-weight);
  letter-spacing: var(--mdui-typescale-headline-medium-tracking);
  line-height: var(--mdui-typescale-headline-medium-line-height);
}

.section-heading p {
  margin: 0.75rem 0 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  line-height: 1.75;
}

.doc-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.doc-card {
  min-height: 13rem;
  padding: 1.25rem;
  border-radius: var(--mdui-shape-corner-large);
}

.doc-card mdui-icon,
.feature-item mdui-icon {
  color: rgb(var(--mdui-color-primary));
  font-size: 1.75rem;
}

.doc-card h3,
.feature-item h3 {
  margin: 1rem 0 0.5rem;
  color: rgb(var(--mdui-color-on-surface));
  font-size: var(--mdui-typescale-title-medium-size);
  font-weight: var(--mdui-typescale-title-medium-weight);
  letter-spacing: var(--mdui-typescale-title-medium-tracking);
  line-height: var(--mdui-typescale-title-medium-line-height);
}

.doc-card p,
.feature-item p {
  margin: 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  line-height: 1.65;
}

.feature-section {
  padding-bottom: 4rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 2rem;
}

.feature-item {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.feature-item h3 {
  margin-top: 0;
}

@media (max-width: 900px) {
  .home-hero {
    grid-template-columns: 1fr;
    min-height: auto;
    padding-top: 3rem;
  }

  .hero-copy h1 {
    font-size: 3.75rem;
  }

  .doc-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .home-hero,
  .home-section {
    width: min(100% - 2rem, 72rem);
  }

  .hero-copy h1 {
    font-size: 2.6rem;
  }

  .lead {
    font-size: 1.0625rem;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
