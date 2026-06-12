<script setup>
import { useI18n } from '../../i18n/index.js'
const { t } = useI18n()
</script>

<template>
  <div>
    <h1>Introduction</h1>

    <p>Let's begin by incorporating mdui into a basic page template using a CDN.</p>

    <blockquote>
      <p>You are currently reading the documentation for mdui 2!</p>
      <p>For mdui 1 documentation, please visit <a href="https://www.mdui.org/docs/">www.mdui.org/docs/</a>.</p>
    </blockquote>

    <h2><a href="#getting-started">Getting Started</a></h2>

    <p>To use mdui, import the CSS and JS files from the CDN.</p>

    <p>For npm installation instructions, refer to the <router-link to="/docs/2/getting-started/installation">Installation</router-link> section.</p>

    <p><strong>Importing Files</strong></p>

    <p>Add the following lines to your page's <code>&lt;head&gt;</code> tag:</p>

    <pre><code class="language-html">&lt;link rel="stylesheet" href="https://unpkg.com/mdui@2/mdui.css" /&gt;
&lt;script src="https://unpkg.com/mdui@2/mdui.global.js"&gt;&lt;/script&gt;</code></pre>

    <p>To utilize the icon attribute (for example, <code>icon="search"</code> in <code>&lt;mdui-button icon="search"&gt;&lt;/mdui-button&gt;</code>), include the CSS file for the icon. Refer to <a href="#">Using Material Icons</a> for more information.</p>

    <p>mdui operates independently of third-party libraries and is ready to use once the files are included.</p>

    <h2><a href="#template">Simplest Page Template</a></h2>

    <p>Below is the simplest page template. You can add more components and content to build your website.</p>

    <pre><code class="language-html">&lt;!doctype html&gt;
&lt;html lang="en"&gt;
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
      <mdui-card href="/docs/2/getting-started/installation" variant="filled" class="card next">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">{{ t('docs.installation') }}</div>
        </div>
      </mdui-card>
    </div>
  </div>
</template>
