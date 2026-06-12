<template>
  <div>
    <h1>Installation</h1>

    <p>mdui can be installed via npm or directly included from a CDN. The recommended method is npm.</p>

    <h2><a href="#npm">Install via npm</a></h2>

    <pre><code class="language-bash">npm install mdui --save</code></pre>

    <h3><a href="#full-import">Full Import</a></h3>

    <p>To utilize all mdui components, import the following two files in your project's entry file:</p>

    <pre><code class="language-js">import 'mdui/mdui.css';
import 'mdui';</code></pre>

    <p>You can also import specific functions from mdui. For example, to import the <code>snackbar</code> function:</p>

    <pre><code class="language-js">import { snackbar } from 'mdui';</code></pre>

    <mdui-collapse>
      <mdui-collapse-item>
        <mdui-button slot="header" variant="text">List all importable functions from mdui</mdui-button>
        <pre><code class="language-js">import {
  $,
  dialog,
  alert,
  confirm,
  prompt,
  snackbar,
  getTheme,
  setTheme,
  getColorFromImage,
  setColorScheme,
  removeColorScheme,
  loadLocale,
  setLocale,
  getLocale,
  throttle,
  observeResize,
  breakpoint
} from 'mdui';</code></pre>
      </mdui-collapse-item>
    </mdui-collapse>

    <h3><a href="#cherry-picking">Cherry-picking Import</a></h3>

    <p>To optimize your project size, import only the necessary components and functions. For example, if you only need the <code>&lt;mdui-button&gt;</code> component and <code>snackbar</code> function, import them as follows:</p>

    <pre><code class="language-js">// Always import the CSS file
import 'mdui/mdui.css';
// Import the &lt;mdui-button&gt; component
import 'mdui/components/button.js';
// Import the snackbar function
import { snackbar } from 'mdui/functions/snackbar.js';</code></pre>

    <p>Each component or function documentation page provides details on how to cherry-pick imports.</p>

    <mdui-collapse>
      <mdui-collapse-item>
        <mdui-button slot="header" variant="text">List all components and functions supported for cherry-picking import</mdui-button>
        <pre><code class="language-js">import 'mdui/components/avatar.js';
import 'mdui/components/badge.js';
import 'mdui/components/bottom-app-bar.js';
import 'mdui/components/button.js';
import 'mdui/components/button-icon.js';
import 'mdui/components/card.js';
import 'mdui/components/checkbox.js';
import 'mdui/components/chip.js';
import 'mdui/components/circular-progress.js';
import 'mdui/components/collapse/collapse.js';
import 'mdui/components/collapse/collapse-item.js';
import 'mdui/components/dialog.js';
import 'mdui/components/divider.js';
import 'mdui/components/dropdown.js';
import 'mdui/components/fab.js';
import 'mdui/components/icon.js';
import 'mdui/components/layout.js';
import 'mdui/components/layout-item.js';
import 'mdui/components/layout-main.js';
import 'mdui/components/linear-progress.js';
import 'mdui/components/list-item.js';
import 'mdui/components/list-subheader.js';
import 'mdui/components/list.js';
import 'mdui/components/menu-item.js';
import 'mdui/components/menu.js';
import 'mdui/components/navigation-bar-item.js';
import 'mdui/components/navigation-bar.js';
import 'mdui/components/navigation-drawer.js';
import 'mdui/components/navigation-rail.js';
import 'mdui/components/navigation-rail-item.js';
import 'mdui/components/radio.js';
import 'mdui/components/radio-group.js';
import 'mdui/components/range-slider.js';
import 'mdui/components/ripple.js';
import 'mdui/components/segmented-button.js';
import 'mdui/components/segmented-button-group.js';
import 'mdui/components/select.js';
import 'mdui/components/slider.js';
import 'mdui/components/snackbar.js';
import 'mdui/components/switch.js';
import 'mdui/components/tab.js';
import 'mdui/components/tab-panel.js';
import 'mdui/components/tabs.js';
import 'mdui/components/text-field.js';
import 'mdui/components/tooltip.js';
import 'mdui/components/top-app-bar-title.js';
import 'mdui/components/top-app-bar.js';
import { $ } from 'mdui/jq.js';
import { alert } from 'mdui/functions/alert.js';
import { breakpoint } from 'mdui/functions/breakpoint.js';
import { confirm } from 'mdui/functions/confirm.js';
import { dialog } from 'mdui/functions/dialog.js';
import { getColorFromImage } from 'mdui/functions/getColorFromImage.js';
import { getLocale } from 'mdui/functions/getLocale.js';
import { getTheme } from 'mdui/functions/getTheme.js';
import { loadLocale } from 'mdui/functions/loadLocale.js';
import { observeResize } from 'mdui/functions/observeResize.js';
import { prompt } from 'mdui/functions/prompt.js';
import { removeColorScheme } from 'mdui/functions/removeColorScheme.js';
import { setColorScheme } from 'mdui/functions/setColorScheme.js';
import { setLocale } from 'mdui/functions/setLocale.js';
import { setTheme } from 'mdui/functions/setTheme.js';
import { snackbar } from 'mdui/functions/snackbar.js';
import { throttle } from 'mdui/functions/throttle.js';</code></pre>
      </mdui-collapse-item>
    </mdui-collapse>

    <h2><a href="#cdn">CDN</a></h2>

    <p>mdui can also be included directly via a CDN using <code>&lt;link&gt;</code> and <code>&lt;script&gt;</code> tags. Alternatively, you can download the CSS and JavaScript files for server deployment. Once included, all mdui components are available for use.</p>

    <h3><a href="#global-build">Global Build</a></h3>

    <p>The global build of mdui exposes all functions as properties on the global <code>mdui</code> object.</p>

    <pre><code class="language-html">&lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css"&gt;
&lt;script src="https://unpkg.com/mdui@2/mdui.global.js"&gt;&lt;/script&gt;

&lt;mdui-button class="btn"&gt;Click me&lt;/mdui-button&gt;

&lt;script&gt;
  document.querySelector('.btn').addEventListener('click', () =&gt; {
    mdui.snackbar({ message: 'Button clicked' });
  });
&lt;/script&gt;</code></pre>

    <h3><a href="#es-module">ES Module Build</a></h3>

    <p>The ES module build of mdui allows you to import it using ES module syntax from the CDN.</p>

    <pre><code class="language-html">&lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css"&gt;

&lt;mdui-button class="btn"&gt;Click me&lt;/mdui-button&gt;

&lt;script type="module"&gt;
  import { snackbar } from 'https://unpkg.com/mdui@2/mdui.esm.js';

  document.querySelector('.btn').addEventListener('click', () =&gt; {
    snackbar({ message: 'Button clicked' });
  });
&lt;/script&gt;</code></pre>

    <div class="docs-nav">
      <mdui-card href="/docs/2/" variant="filled" class="card prev">
        <div class="container">
          <div class="overline"><mdui-icon name="east--rounded" class="arrow"></mdui-icon> {{ t('navPrev') }}</div>
          <div class="title">{{ t('docs.introduction') }}</div>
        </div>
      </mdui-card>
      <mdui-card href="/docs/2/getting-started/usage" variant="filled" class="card next">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">{{ t('docs.usage') }}</div>
        </div>
      </mdui-card>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../../i18n/index.js'
const { t } = useI18n()
</script>
