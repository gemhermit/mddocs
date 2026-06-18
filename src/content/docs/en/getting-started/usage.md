# Usage

mdui components, as standard Web Components, can be used like `<div>` elements. Each component's documentation provides a comprehensive API, including attributes, methods, events, slots, CSS parts, and CSS custom properties.

This guide focuses on the usage of Web Components.

## Attributes {#attribute}

Attributes are divided into HTML attributes and JavaScript properties. They usually correspond one-to-one and are synchronized. This means that updating an HTML attribute value also updates the JavaScript property value, and vice versa.

HTML attributes can be set directly in the component's HTML string. They can be read or modified using the `getAttribute` and `setAttribute` methods:

```html
<mdui-button variant="text">Click me</mdui-button>

<script>
  const button = document.querySelector('mdui-button');
  button.setAttribute('variant', 'outlined');
  console.log(button.getAttribute('variant')); // outlined
</script>
```

JavaScript properties can be accessed directly on the component instance or set to modify the property value:

```html
<mdui-button variant="text">Click me</mdui-button>

<script>
  const button = document.querySelector('mdui-button');
  button.variant = 'outlined';
  console.log(button.variant); // outlined
</script>
```

Some attributes are boolean. The corresponding JavaScript property is `true` when the HTML attribute exists and `false` otherwise. However, mdui treats the string value `false` as equivalent to the boolean value `false` for compatibility with certain frameworks.

## Methods {#method}

Components provide public methods that trigger specific behaviors. For example, the `focus()` method of the `<mdui-text-field>` component sets the focus on the text field.

```html
<mdui-text-field></mdui-text-field>

<script>
  const textField = document.querySelector('mdui-text-field');
  textField.focus();
</script>
```

## Events {#event}

Components emit events in response to specific actions. For example, the `<mdui-dialog>` component emits an `open` event when it begins to open. These events can be listened to, enabling the execution of custom actions.

```html
<mdui-dialog>Dialog</mdui-dialog>

<script>
  const dialog = document.querySelector('mdui-dialog');
  dialog.addEventListener('open', () => {
    console.log('This event is triggered when the dialog starts opening');
  });
</script>
```

## Slot {#slot}

Components often provide slots for inserting custom HTML content.

The default slot is the most common, used for plain HTML or text within the component. For example, the default slot of the `<mdui-button>` component sets the button's text:

```html
<mdui-button>Click me</mdui-button>
```

Some components also offer named slots. You should specify the slot name in the HTML's `slot` attribute.

```html
<mdui-button>
  <mdui-icon slot="start" name="settings"></mdui-icon>
  Settings
</mdui-button>
```

## CSS Custom Properties {#css-custom-properties}

mdui utilizes CSS Custom Properties, also known as CSS variables, to establish a series of global design tokens. These tokens are referenced by various components, enabling you to adjust the styles of mdui components globally.

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

mdui components utilize the shadow DOM for encapsulating styles and behaviors. Some components add a `part` attribute to elements within the shadow DOM. These elements can be selected and styled using the `::part` CSS selector.

## Component Update Mechanism {#update-mechanism}

mdui components are built using [Lit](https://lit.dev/). When you modify the properties of mdui components, the components will re-render. This re-rendering is not synchronous, so multiple property changes are buffered until the next update cycle.

```js
const button = document.querySelector('mdui-button');
button.disabled = true;

button.updateComplete.then(() => {
  console.log(button.hasAttribute('disabled')); // true
});
```
