<template>
  <div>
    <h1>概述</h1>

    <p>让我们通过 mdui 的 CDN 和一个最简单的页面模板来开始使用 mdui。</p>

    <blockquote>
      <p>你正在阅读的是 mdui 2 的文档！</p>
      <p>若要阅读 mdui 1 的文档，请访问 <a href="https://www.mdui.org/docs/">www.mdui.org/docs/</a>。</p>
    </blockquote>

    <h2><a href="#getting-started">快速入门</a></h2>

    <p>使用 mdui 最简单的方式是直接从 CDN 引入 CSS 和 JS 文件。</p>

    <p>如果你想使用 npm 安装 mdui，请参考 <router-link to="/zh-cn/docs/2/getting-started/installation">安装</router-link> 章节。</p>

    <p><strong>引入文件</strong></p>

    <p>将下面代码添加到页面的 <code>&lt;head&gt;</code> 标签中：</p>

    <pre><code class="language-html">&lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css" /&gt;
&lt;script src="https://unpkg.com/mdui@2/mdui.global.js"&gt;&lt;/script&gt;</code></pre>

    <p>如果你需要使用组件的图标属性（例如 <code>&lt;mdui-button icon="search"&gt;&lt;/mdui-button&gt;</code> 中的 <code>icon</code> 属性），则还需要引入图标的 CSS 文件，参见 <a href="#">使用 Material Icons 图标</a>。</p>

    <p>mdui 不依赖任何第三方库，引入上述文件后，就能正常工作了。</p>

    <h2><a href="#template">最简单的页面模板</a></h2>

    <p>下面是一个最简单的页面模板，你可以在其中添加更多组件和内容，来构建一个网站。</p>

    <pre><code class="language-html">&lt;!doctype html&gt;
&lt;html lang="zh-CN"&gt;
  &lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"/&gt;
    &lt;meta name="renderer" content="webkit"/&gt;

    &lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css"&gt;
    &lt;script src="https://unpkg.com/mdui@2/mdui.global.js"&gt;&lt;/script&gt;

    &lt;title&gt;Hello, world!&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;mdui-button&gt;Hello, world!&lt;/mdui-button&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

    <div class="docs-nav">
      <div class="card prev"></div>
      <mdui-card href="/zh-cn/docs/2/getting-started/installation" variant="filled" class="card next">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">{{ t('docs.installation') }}</div>
        </div>
      </mdui-card>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../../../i18n/index.js'
const { t } = useI18n()
</script>
