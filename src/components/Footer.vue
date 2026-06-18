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

    <footer class="footer" data-nosnippet>
      <div class="brand">
        <a :href="homePath" class="logo">{{ t('app.name') }}</a>
        <p>{{ t('footer.description') }}</p>
        <div class="meta">
          <span>{{ t('footer.basedOn') }}</span>
          <span>{{ t('footer.openSource') }}</span>
        </div>
      </div>

      <nav class="groups" :aria-label="t('footer.navigation')">
        <ul class="links">
          <li class="title">{{ t('footer.project') }}</li>
          <li><a :href="docsPath">{{ t('footer.docsHome') }}</a></li>
          <li><a :href="docsPath + '/getting-started/installation'">{{ t('docs.installation') }}</a></li>
          <li><a :href="docsPath + '/getting-started/usage'">{{ t('docs.usage') }}</a></li>
        </ul>

        <ul class="links">
          <li class="title">{{ t('footer.openSource') }}</li>
          <li><a href="https://github.com/gemhermit/mddocs" target="_blank" rel="noopener">{{ t('footer.repository') }}</a></li>
          <li><a href="https://github.com/gemhermit/mddocs/issues" target="_blank" rel="noopener">{{ t('footer.feedback') }}</a></li>
        </ul>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/index.js'
import { getDocsBase, getLocalePrefix } from '../utils/site.js'

const { t, locale } = useI18n()
const docsPath = computed(() => getDocsBase(locale.value))
const homePath = computed(() => getLocalePrefix(locale.value) || '/')
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

.footer {
  display: grid;
  grid-template-columns: minmax(16rem, 1fr) minmax(0, 2fr);
  gap: 3rem;
  width: min(100% - 3rem, 72rem);
  margin: 0 auto;
  padding: 3rem 0;
}

.brand {
  max-width: 28rem;
}

.logo {
  display: inline-flex;
  color: rgb(var(--mdui-color-on-surface));
  font-size: var(--mdui-typescale-title-large-size);
  font-weight: var(--mdui-typescale-title-large-weight);
  letter-spacing: var(--mdui-typescale-title-large-tracking);
  line-height: var(--mdui-typescale-title-large-line-height);
}

.brand p {
  margin: 1rem 0 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  line-height: 1.75;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.meta span {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0 0.75rem;
  border-radius: var(--mdui-shape-corner-full);
  color: rgb(var(--mdui-color-on-secondary-container));
  background: rgb(var(--mdui-color-secondary-container));
  font-size: var(--mdui-typescale-label-large-size);
  font-weight: var(--mdui-typescale-label-large-weight);
  letter-spacing: var(--mdui-typescale-label-large-tracking);
  line-height: var(--mdui-typescale-label-large-line-height);
}

.groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.links {
  list-style: none;
}

.links li {
  min-width: 0;
}

.links .title {
  color: rgb(var(--mdui-color-on-surface));
  margin-bottom: 0.5rem;
  font-size: var(--mdui-typescale-title-small-size);
  font-weight: var(--mdui-typescale-title-small-weight);
  letter-spacing: var(--mdui-typescale-title-small-tracking);
  line-height: var(--mdui-typescale-title-small-line-height);
}

.links a {
  display: block;
  padding: 0.35rem 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-body-medium-size);
  font-weight: var(--mdui-typescale-body-medium-weight);
  letter-spacing: var(--mdui-typescale-body-medium-tracking);
  line-height: var(--mdui-typescale-body-medium-line-height);
}

.muted {
  display: block;
  padding: 0.35rem 0;
  color: rgb(var(--mdui-color-on-surface-variant));
  font-size: var(--mdui-typescale-body-medium-size);
  font-weight: var(--mdui-typescale-body-medium-weight);
  letter-spacing: var(--mdui-typescale-body-medium-tracking);
  line-height: var(--mdui-typescale-body-medium-line-height);
}

.links a:hover {
  color: rgb(var(--mdui-color-primary));
}

@media (max-width: 900px) {
  .footer {
    grid-template-columns: 1fr;
  }

  .groups {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .footer {
    width: min(100% - 2rem, 72rem);
  }

  .groups {
    grid-template-columns: 1fr;
  }
}
</style>
