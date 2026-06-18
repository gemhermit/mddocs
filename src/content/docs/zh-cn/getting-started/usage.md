# 快速入门

mdui 组件是标准的 Web Components，可以像 `<div>` 一样使用。每个组件的文档都提供了完整的 API，包括属性、方法、事件、插槽、CSS Part 和 CSS 自定义属性。

本节重点介绍 Web Components 的使用方式。

## 属性 {#attribute}

属性分为 HTML 属性和 JavaScript 属性。它们通常一一对应并同步。这意味着更新 HTML 属性值也会更新 JavaScript 属性值，反之亦然。

HTML 属性可以直接在组件的 HTML 字符串中设置。可以使用 `getAttribute` 和 `setAttribute` 方法读取或修改：

```html
<mdui-button variant="text">点击我</mdui-button>

<script>
  const button = document.querySelector('mdui-button');
  button.setAttribute('variant', 'outlined');
  console.log(button.getAttribute('variant')); // outlined
</script>
```

JavaScript 属性可以直接在组件实例上访问或设置：

```html
<mdui-button variant="text">点击我</mdui-button>

<script>
  const button = document.querySelector('mdui-button');
  button.variant = 'outlined';
  console.log(button.variant); // outlined
</script>
```

某些属性是布尔值。当 HTML 属性存在时，对应的 JavaScript 属性为 `true`，否则为 `false`。但是，mdui 将字符串值 `false` 视为等同于布尔值 `false`，以兼容某些框架。

## 方法 {#method}

组件提供公共方法来触发特定行为。例如，`<mdui-text-field>` 组件的 `focus()` 方法用于将焦点设置在文本字段上。

```html
<mdui-text-field></mdui-text-field>

<script>
  const textField = document.querySelector('mdui-text-field');
  textField.focus();
</script>
```

## 事件 {#event}

组件在响应特定操作时会触发事件。例如，`<mdui-dialog>` 组件在开始打开时会触发 `open` 事件。可以监听这些事件来执行自定义操作。

```html
<mdui-dialog>对话框</mdui-dialog>

<script>
  const dialog = document.querySelector('mdui-dialog');
  dialog.addEventListener('open', () => {
    console.log('此事件在对话框开始打开时触发');
  });
</script>
```

## 插槽 {#slot}

组件通常提供插槽用于插入自定义 HTML 内容。

默认插槽是最常用的，用于组件内的纯 HTML 或文本。例如，`<mdui-button>` 组件的默认插槽用于设置按钮文本：

```html
<mdui-button>点击我</mdui-button>
```

某些组件还提供具名插槽。你需要在 HTML 的 `slot` 属性中指定插槽名称：

```html
<mdui-button>
  <mdui-icon slot="start" name="settings"></mdui-icon>
  设置
</mdui-button>
```

## CSS 自定义属性 {#css-custom-properties}

mdui 使用 CSS Custom Properties（也称为 CSS 变量）来建立一系列全局设计令牌。这些令牌被各种组件引用，使你能够全局调整 mdui 组件的样式。

```css
:root {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}
```

## CSS Part {#css-part}

mdui 组件使用 Shadow DOM 来封装样式和行为。但是，标准 CSS 选择器无法选择 Shadow DOM 内的元素。为此，某些组件在 Shadow DOM 内的元素上添加了 `part` 属性。可以使用 `::part` CSS 选择器来选择和样式化这些元素。

## 组件更新机制 {#update-mechanism}

mdui 组件使用 [Lit](https://lit.dev/) 构建。当你修改 mdui 组件的属性时，组件会重新渲染。但这种重新渲染不是同步的。当多个属性值同时变化时，Lit 会将这些变化缓冲到下一个更新周期。

```js
const button = document.querySelector('mdui-button');
button.disabled = true;

button.updateComplete.then(() => {
  console.log(button.hasAttribute('disabled')); // true
});
```
