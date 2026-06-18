# Vue and Vite

MDDocs is built with Vue 3 and Vite. Vue powers the component-based interface, while Vite handles the dev server, module loading, and production builds.

## Why Vue {#why-vue}

Vue works well for documentation sites because:

- Components such as AppBar, Sidebar, and Footer are easy to maintain separately.
- Reactive state fits locale, theme, table of contents, and drawer behavior.
- Vue Router makes bilingual paths straightforward.

## Markdown Loading {#markdown-loading}

Markdown files are collected at build time with `import.meta.glob`:

```js
const markdownModules = import.meta.glob('../../content/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})
```

Each Markdown file becomes a string in the bundle and is rendered to HTML with `markdown-it`.

## Route Layout {#router-layout}

Docs pages share `DocsLayout.vue`, and the content is rendered by `MarkdownDoc.vue`. The sidebar and page table of contents are handled at the layout level.

This keeps Markdown pages focused on content instead of repeating page chrome.

## Developer Experience {#developer-experience}

Start the dev server with:

```bash
npm run dev
```

Vue components, CSS, and Markdown files update during development. If a newly added file does not appear, restart the dev server so Vite can collect the new module.

