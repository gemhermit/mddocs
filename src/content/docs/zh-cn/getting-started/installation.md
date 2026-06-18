# 安装

mdui 可以通过 npm 安装，也可以直接从 CDN 引入。推荐使用 npm 安装。

## 通过 npm 安装 {#npm}

```bash
npm install mdui --save
```

### 完整引入 {#full-import}

在项目的入口文件中引入以下两个文件，即可使用所有 mdui 组件：

```js
import 'mdui/mdui.css';
import 'mdui';
```

你也可以从 mdui 中单独引入特定的函数。例如，要引入 [`snackbar`](/zh-cn/docs/2/functions/snackbar) 函数：

```js
import { snackbar } from 'mdui';
```

<mdui-collapse>
  <mdui-collapse-item>
    <mdui-button slot="header" variant="text">列出所有可从 mdui 引入的函数</mdui-button>
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

### 按需引入 {#cherry-picking}

为了优化项目体积，你可以只引入需要的组件和函数。例如，如果只需要 [`<mdui-button>`](/zh-cn/docs/2/components/button) 组件和 [`snackbar`](/zh-cn/docs/2/functions/snackbar) 函数：

```js
// 始终引入 CSS 文件
import 'mdui/mdui.css';
// 引入 <mdui-button> 组件
import 'mdui/components/button.js';
// 引入 snackbar 函数
import { snackbar } from 'mdui/functions/snackbar.js';
```

每个组件或函数的文档页面中都提供了按需引入的说明。

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

## CDN {#cdn}

mdui 也可以通过 CDN 直接引入。使用 `<link>` 和 `<script>` 标签即可。引入后，所有 mdui 组件都可以直接使用。

### 全局构建 {#global-build}

mdui 的全局构建将所有函数暴露在全局 `mdui` 对象上。

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">
<script src="https://unpkg.com/mdui@2/mdui.global.js"></script>

<mdui-button class="btn">Click me</mdui-button>

<script>
  document.querySelector('.btn').addEventListener('click', () => {
    mdui.snackbar({ message: 'Button clicked' });
  });
</script>
```

### ES Module 构建 {#es-module}

mdui 的 ES Module 构建允许你使用 ES module 语法从 CDN 引入。

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css">

<mdui-button class="btn">Click me</mdui-button>

<script type="module">
  import { snackbar } from 'https://unpkg.com/mdui@2/mdui.esm.js';

  document.querySelector('.btn').addEventListener('click', () => {
    snackbar({ message: 'Button clicked' });
  });
</script>
```
