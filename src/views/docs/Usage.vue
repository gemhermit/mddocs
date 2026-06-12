<template>
  <div>
    <h1>Usage</h1>

    <p>mdui components, as standard Web Components, can be used like <code>&lt;div&gt;</code> elements. Each component's documentation provides a comprehensive API, including attributes, methods, events, slots, CSS parts, and CSS custom properties.</p>

    <p>This guide focuses on the usage of Web Components.</p>

    <h2><a href="#attribute">Attributes</a></h2>

    <p>Attributes are divided into HTML attributes and JavaScript properties. They usually correspond one-to-one and are synchronized. This means that updating an HTML attribute value also updates the JavaScript property value, and vice versa.</p>

    <p>HTML attributes can be set directly in the component's HTML string. They can be read or modified using the <code>getAttribute</code> and <code>setAttribute</code> methods:</p>

    <pre><code class="language-html">&lt;mdui-button variant="text"&gt;Click me&lt;/mdui-button&gt;

&lt;script&gt;
  const button = document.querySelector('mdui-button');

  // Modify HTML attribute
  button.setAttribute('variant', 'outlined');

  // Read HTML attribute
  console.log(button.getAttribute('variant')); // outlined
&lt;/script&gt;</code></pre>

    <p>JavaScript properties can be accessed directly on the component instance or set to modify the property value:</p>

    <pre><code class="language-html">&lt;mdui-button variant="text"&gt;Click me&lt;/mdui-button&gt;

&lt;script&gt;
  const button = document.querySelector('mdui-button');

  // Set JavaScript property
  button.variant = 'outlined';

  // Read JavaScript property
  console.log(button.variant); // outlined
&lt;/script&gt;</code></pre>

    <p>Some attributes are boolean. The corresponding JavaScript property is <code>true</code> when the HTML attribute exists and <code>false</code> otherwise. However, mdui treats the string value <code>false</code> as equivalent to the boolean value <code>false</code> for compatibility with certain frameworks.</p>

    <pre><code class="language-html">&lt;!-- This component has the disabled attribute, so the disabled property is true by default --&gt;
&lt;mdui-button disabled&gt;&lt;/mdui-button&gt;

&lt;script&gt;
  const button = document.querySelector('mdui-button');

  button.removeAttribute('disabled'); // Equivalent to button.disabled = false;
  button.setAttribute('disabled', ''); // Equivalent to button.disabled = true;

  // Exception: setting to the string "false" value is equivalent to setting to the boolean value false
  button.setAttribute('disabled', 'false'); // Equivalent to button.disabled = false;
&lt;/script&gt;</code></pre>

    <p>For properties that are arrays, objects, or functions, there is only a JavaScript property, and no corresponding HTML attribute. For example, the <code>&lt;mdui-slider&gt;</code> component's <code>labelFormatter</code> property is a function, which can only be set using JavaScript property:</p>

    <pre><code class="language-html">&lt;mdui-slider&gt;&lt;/mdui-slider&gt;

&lt;script&gt;
  const slider = document.querySelector('mdui-slider');
  slider.labelFormatter = (value) =&gt; `${value}%`;
&lt;/script&gt;</code></pre>

    <p>Here's an example from the attribute documentation of the <code>&lt;mdui-slider&gt;</code> component:</p>

    <table>
      <thead>
        <tr>
          <th>HTML Attribute</th>
          <th>JavaScript Property</th>
          <th>reflect</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>name</code></td>
          <td><code>name</code></td>
          <td><span class="material-icons" style="font-size:1rem">check</span></td>
        </tr>
        <tr>
          <td><code>value</code></td>
          <td><code>value</code></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td><code>labelFormatter</code></td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <p>The <code>name</code> attribute of this component has both HTML and JavaScript properties, and the reflect column indicates that if the JavaScript property is updated, the HTML attribute will also be updated. However, the <code>value</code> attribute does not reflect changes from the JavaScript property to the HTML attribute. The <code>labelFormatter</code> property only exists as a JavaScript property.</p>

    <h2><a href="#method">Methods</a></h2>

    <p>Components provide public methods that trigger specific behaviors. For example, the <code>focus()</code> method of the <code>&lt;mdui-text-field&gt;</code> component sets the focus on the text field.</p>

    <pre><code class="language-html">&lt;mdui-text-field&gt;&lt;/mdui-text-field&gt;

&lt;script&gt;
  const textField = document.querySelector('mdui-text-field');
  textField.focus();
&lt;/script&gt;</code></pre>

    <p>Please refer to the individual documentation of each component for a comprehensive list of methods and their parameters.</p>

    <h2><a href="#event">Events</a></h2>

    <p>Components emit events in response to specific actions. For example, the <code>&lt;mdui-dialog&gt;</code> component emits an <code>open</code> event when it begins to open. These events can be listened to, enabling the execution of custom actions.</p>

    <pre><code class="language-html">&lt;mdui-dialog&gt;Dialog&lt;/mdui-dialog&gt;

&lt;script&gt;
  const dialog = document.querySelector('mdui-dialog');

  dialog.addEventListener('open', () =&gt; {
    console.log('This event is triggered when the dialog starts opening');
  });
&lt;/script&gt;</code></pre>

    <p>A comprehensive list of events and their parameters for each component can be found in their respective documentation pages.</p>

    <h2><a href="#slot">Slot</a></h2>

    <p>Components often provide slots for inserting custom HTML content.</p>

    <p>The default slot is the most common, used for plain HTML or text within the component. For example, the default slot of the <code>&lt;mdui-button&gt;</code> component sets the button's text:</p>

    <pre><code class="language-html">&lt;mdui-button&gt;Click me&lt;/mdui-button&gt;</code></pre>

    <p>Some components also offer named slots. You should specify the slot name in the HTML's <code>slot</code> attribute. For example, the <code>&lt;mdui-icon&gt;</code> component uses <code>slot="start"</code> to indicate a named slot called <code>start</code>, positioning the icon on the left inside the component:</p>

    <pre><code class="language-html">&lt;mdui-button&gt;
  &lt;mdui-icon slot="start" name="settings"&gt;&lt;/mdui-icon&gt;
  Settings
&lt;/mdui-button&gt;</code></pre>

    <h2><a href="#css-custom-properties">CSS Custom Properties</a></h2>

    <p>mdui utilizes CSS Custom Properties, also known as CSS variables, to establish a series of global design tokens. These tokens are referenced by various components, enabling you to adjust the styles of mdui components globally.</p>

    <p>For example, you can reduce the corner radius of all components by modifying the relevant CSS custom properties:</p>

    <pre><code class="language-css">:root {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}</code></pre>

    <h2><a href="#css-part">CSS Part</a></h2>

    <p>mdui components utilize the shadow DOM for encapsulating styles and behaviors. However, standard CSS selectors cannot select elements within the shadow DOM. To overcome this, some components add a <code>part</code> attribute to elements within the shadow DOM. These elements can then be selected and styled using the <code>::part</code> CSS selector.</p>

    <p>For example, the <code>button</code> part modifies the inner padding of the button, while the <code>label</code>, <code>icon</code>, and <code>end-icon</code> parts adjust the text color, left icon color, and right icon color, respectively:</p>

    <pre><code class="language-html">&lt;mdui-button class="custom-button" icon="explore" end-icon="flight"&gt;Button&lt;/mdui-button&gt;

&lt;style&gt;
  .custom-button::part(button) {
    padding: 0 2rem;
  }

  .custom-button::part(label) {
    color: blue;
  }

  .custom-button::part(icon) {
    color: red;
  }

  .custom-button::part(end-icon) {
    color: yellow;
  }
&lt;/style&gt;</code></pre>

    <h2><a href="#update-mechanism">Component Update Mechanism</a></h2>

    <p>mdui components are built using <a href="https://lit.dev/" target="_blank" rel="noopener nofollow">Lit</a>, a lightweight library that streamlines the development of Web Components. Understanding the rendering and update mechanism of the components can enhance your experience when using mdui components.</p>

    <p>When you modify the properties of mdui components, the components will re-render. However, this re-rendering is not synchronous. When multiple property values change at the same time, Lit buffers these changes until the next update cycle.</p>

    <p>To ensure a component has completed re-rendering after a property value change, you can use the <code>updateComplete</code> property. This property returns a Promise that resolves once the component finishes re-rendering.</p>

    <pre><code class="language-js">const button = document.querySelector('mdui-button');
button.disabled = true;

button.updateComplete.then(() =&gt; {
  console.log(button.hasAttribute('disabled')); // true
});</code></pre>

    <div class="docs-nav">
      <mdui-card href="/docs/2/getting-started/installation" variant="filled" class="card prev">
        <div class="container">
          <div class="overline"><mdui-icon name="east--rounded" class="arrow"></mdui-icon> {{ t('navPrev') }}</div>
          <div class="title">{{ t('docs.installation') }}</div>
        </div>
      </mdui-card>
      <div class="card next" style="opacity:0.3;pointer-events:none">
        <div class="container">
          <div class="overline">{{ t('navNext') }} <mdui-icon name="east--rounded" class="arrow"></mdui-icon></div>
          <div class="title">Coming soon</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from '../../i18n/index.js'
const { t } = useI18n()
</script>
