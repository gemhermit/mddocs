<template>
  <div>
    <h1>快速入门</h1>

    <p>mdui 组件是标准的 Web Components，可以像 <code>&lt;div&gt;</code> 一样使用。每个组件的文档都提供了完整的 API，包括属性、方法、事件、插槽、CSS Part 和 CSS 自定义属性。</p>

    <p>本节重点介绍 Web Components 的使用方式。</p>

    <h2><a href="#attribute">属性</a></h2>

    <p>属性分为 HTML 属性和 JavaScript 属性。它们通常一一对应并同步。这意味着更新 HTML 属性值也会更新 JavaScript 属性值，反之亦然。</p>

    <p>HTML 属性可以直接在组件的 HTML 字符串中设置。可以使用 <code>getAttribute</code> 和 <code>setAttribute</code> 方法读取或修改：</p>

    <pre><code class="language-html">&lt;mdui-button variant="text"&gt;点击我&lt;/mdui-button&gt;

&lt;script&gt;
  const button = document.querySelector('mdui-button');
  button.setAttribute('variant', 'outlined');
  console.log(button.getAttribute('variant')); // outlined
&lt;/script&gt;</code></pre>

    <p>JavaScript 属性可以直接在组件实例上访问或设置：</p>

    <pre><code class="language-html">&lt;mdui-button variant="text"&gt;点击我&lt;/mdui-button&gt;

&lt;script&gt;
  const button = document.querySelector('mdui-button');
  button.variant = 'outlined';
  console.log(button.variant); // outlined
&lt;/script&gt;</code></pre>

    <p>某些属性是布尔值。当 HTML 属性存在时，对应的 JavaScript 属性为 <code>true</code>，否则为 <code>false</code>。但是，mdui 将字符串值 <code>false</code> 视为等同于布尔值 <code>false</code>，以兼容某些框架。</p>

    <h2><a href="#method">方法</a></h2>

    <p>组件提供公共方法来触发特定行为。例如，<code>&lt;mdui-text-field&gt;</code> 组件的 <code>focus()</code> 方法用于将焦点设置在文本字段上。</p>

    <pre><code class="language-html">&lt;mdui-text-field&gt;&lt;/mdui-text-field&gt;

&lt;script&gt;
  const textField = document.querySelector('mdui-text-field');
  textField.focus();
&lt;/script&gt;</code></pre>

    <h2><a href="#event">事件</a></h2>

    <p>组件在响应特定操作时会触发事件。例如，<code>&lt;mdui-dialog&gt;</code> 组件在开始打开时会触发 <code>open</code> 事件。可以监听这些事件来执行自定义操作。</p>

    <pre><code class="language-html">&lt;mdui-dialog&gt;对话框&lt;/mdui-dialog&gt;

&lt;script&gt;
  const dialog = document.querySelector('mdui-dialog');
  dialog.addEventListener('open', () =&gt; {
    console.log('此事件在对话框开始打开时触发');
  });
&lt;/script&gt;</code></pre>

    <h2><a href="#slot">插槽</a></h2>

    <p>组件通常提供插槽用于插入自定义 HTML 内容。</p>

    <p>默认插槽是最常用的，用于组件内的纯 HTML 或文本。例如，<code>&lt;mdui-button&gt;</code> 组件的默认插槽用于设置按钮文本：</p>

    <pre><code class="language-html">&lt;mdui-button&gt;点击我&lt;/mdui-button&gt;</code></pre>

    <p>某些组件还提供具名插槽。你需要在 HTML 的 <code>slot</code> 属性中指定插槽名称：</p>

    <pre><code class="language-html">&lt;mdui-button&gt;
  &lt;mdui-icon slot="start" name="settings"&gt;&lt;/mdui-icon&gt;
  设置
&lt;/mdui-button&gt;</code></pre>

    <h2><a href="#css-custom-properties">CSS 自定义属性</a></h2>

    <p>mdui 使用 CSS Custom Properties（也称为 CSS 变量）来建立一系列全局设计令牌。这些令牌被各种组件引用，使你能够全局调整 mdui 组件的样式。</p>

    <p>例如，你可以通过修改相关的 CSS 自定义属性来减小所有组件的圆角：</p>

    <pre><code class="language-css">:root {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}</code></pre>

    <h2><a href="#css-part">CSS Part</a></h2>

    <p>mdui 组件使用 Shadow DOM 来封装样式和行为。但是，标准 CSS 选择器无法选择 Shadow DOM 内的元素。为此，某些组件在 Shadow DOM 内的元素上添加了 <code>part</code> 属性。可以使用 <code>::part</code> CSS 选择器来选择和样式化这些元素。</p>

    <h2><a href="#update-mechanism">组件更新机制</a></h2>

    <p>mdui 组件使用 <a href="https://lit.dev/" target="_blank" rel="noopener nofollow">Lit</a> 构建。当你修改 mdui 组件的属性时，组件会重新渲染。但这种重新渲染不是同步的。当多个属性值同时变化时，Lit 会将这些变化缓冲到下一个更新周期。</p>

    <p>要确保组件在属性值更改后已完成重新渲染，可以使用 <code>updateComplete</code> 属性。该属性返回一个 Promise，在组件完成重新渲染后解析。</p>

    <pre><code class="language-js">const button = document.querySelector('mdui-button');
button.disabled = true;

button.updateComplete.then(() =&gt; {
  console.log(button.hasAttribute('disabled')); // true
});</code></pre>

    <div class="docs-nav">
      <mdui-card href="/zh-cn/docs/2/getting-started/installation" variant="filled" class="card prev">
        <div class="container">
          <div class="overline"><mdui-icon name="east--rounded" class="arrow"></mdui-icon> {{ t('navPrev') }}</div>
          <div class="title">{{ t('docs.installation') }}</div>
        </div>
      </mdui-card>
      <div class="card next" style="opacity:0.3;pointer-events:none">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">即将上线</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../../../i18n/index.js'
const { t } = useI18n()
</script>
