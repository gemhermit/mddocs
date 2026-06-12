<template>
  <div>
    <h1>安装</h1>

    <p>mdui 可以通过 npm 安装，也可以直接从 CDN 引入。推荐使用 npm 安装。</p>

    <h2><a href="#npm">通过 npm 安装</a></h2>

    <pre><code class="language-bash">npm install mdui --save</code></pre>

    <h3><a href="#full-import">完整引入</a></h3>

    <p>在项目的入口文件中引入以下两个文件，即可使用所有 mdui 组件：</p>

    <pre><code class="language-js">import 'mdui/mdui.css';
import 'mdui';</code></pre>

    <p>你也可以从 mdui 中单独引入特定的函数。例如，要引入 <code>snackbar</code> 函数：</p>

    <pre><code class="language-js">import { snackbar } from 'mdui';</code></pre>

    <mdui-collapse>
      <mdui-collapse-item>
        <mdui-button slot="header" variant="text">列出所有可从 mdui 引入的函数</mdui-button>
        <pre><code class="language-js">import {
  $, dialog, alert, confirm, prompt, snackbar,
  getTheme, setTheme, getColorFromImage,
  setColorScheme, removeColorScheme,
  loadLocale, setLocale, getLocale,
  throttle, observeResize, breakpoint
} from 'mdui';</code></pre>
      </mdui-collapse-item>
    </mdui-collapse>

    <h3><a href="#cherry-picking">按需引入</a></h3>

    <p>为了优化项目体积，你可以只引入需要的组件和函数。例如，如果只需要 <code>&lt;mdui-button&gt;</code> 组件和 <code>snackbar</code> 函数：</p>

    <pre><code class="language-js">// 始终引入 CSS 文件
import 'mdui/mdui.css';
// 引入 &lt;mdui-button&gt; 组件
import 'mdui/components/button.js';
// 引入 snackbar 函数
import { snackbar } from 'mdui/functions/snackbar.js';</code></pre>

    <p>每个组件或函数的文档页面中都提供了按需引入的说明。</p>

    <mdui-collapse>
      <mdui-collapse-item>
        <mdui-button slot="header" variant="text">列出所有支持按需引入的组件和函数</mdui-button>
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

    <p>mdui 也可以通过 CDN 直接引入。使用 <code>&lt;link&gt;</code> 和 <code>&lt;script&gt;</code> 标签即可。引入后，所有 mdui 组件都可以直接使用。</p>

    <h3><a href="#global-build">全局构建</a></h3>

    <p>mdui 的全局构建将所有函数暴露在全局 <code>mdui</code> 对象上。</p>

    <pre><code class="language-html">&lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css"&gt;
&lt;script src="https://unpkg.com/mdui@2/mdui.global.js"&gt;&lt;/script&gt;

&lt;mdui-button class="btn"&gt;Click me&lt;/mdui-button&gt;

&lt;script&gt;
  document.querySelector('.btn').addEventListener('click', () =&gt; {
    mdui.snackbar({ message: 'Button clicked' });
  });
&lt;/script&gt;</code></pre>

    <h3><a href="#es-module">ES Module 构建</a></h3>

    <p>mdui 的 ES Module 构建允许你使用 ES module 语法从 CDN 引入。</p>

    <pre><code class="language-html">&lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css"&gt;

&lt;mdui-button class="btn"&gt;Click me&lt;/mdui-button&gt;

&lt;script type="module"&gt;
  import { snackbar } from 'https://unpkg.com/mdui@2/mdui.esm.js';

  document.querySelector('.btn').addEventListener('click', () =&gt; {
    snackbar({ message: 'Button clicked' });
  });
&lt;/script&gt;</code></pre>

    <div class="docs-nav">
      <mdui-card href="/zh-cn/docs/2/" variant="filled" class="card prev">
        <div class="container">
          <div class="overline"><mdui-icon name="east--rounded" class="arrow"></mdui-icon> {{ t('navPrev') }}</div>
          <div class="title">{{ t('docs.introduction') }}</div>
        </div>
      </mdui-card>
      <mdui-card href="/zh-cn/docs/2/getting-started/usage" variant="filled" class="card next">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">{{ t('docs.usage') }}</div>
        </div>
      </mdui-card>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../../../i18n/index.js'
const { t } = useI18n()
</script>
