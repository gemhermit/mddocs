# Usage

This page explains how to use MDDocs to write and organize your own documentation.

## Edit Existing Docs {#edit-docs}

The simplest workflow is editing Markdown files under `src/content/docs`.

For example, the English usage page lives at:

```text
src/content/docs/en/getting-started/usage.md
```

The matching Chinese page lives at:

```text
src/content/docs/zh-cn/getting-started/usage.md
```

After saving a file, the Vite dev server refreshes the page automatically.

## Add a New Page {#add-page}

Adding a page usually takes three steps.

### 1. Add Markdown Files {#add-markdown}

Create matching files for each locale:

```text
src/content/docs/en/getting-started/configuration.md
src/content/docs/zh-cn/getting-started/configuration.md
```

Use a level-one heading as the page title:

```md
# Configuration
```

### 2. Add Sidebar Data {#add-sidebar-data}

Add the page entry in `src/data/docs.js`:

```js
{
  id: 'configuration',
  titleKey: 'docs.configuration',
  path: 'getting-started/configuration'
}
```

`path` is used for sidebar links and previous/next page navigation. Routes are generated from the sidebar data, so this is the only place you need to update for page ordering.

## Add Translated Labels {#add-i18n}

If a new `titleKey` is used in sidebar data, add matching labels in `src/i18n/index.js`:

```js
docs: {
  configuration: 'Configuration'
}
```

Add the Chinese label too:

```js
docs: {
  configuration: '配置'
}
```

## Heading Anchors {#heading-anchors}

Second-level and third-level headings are shown in the page table of contents. Use `{#id}` to define a stable anchor:

```md
## Add a New Page {#add-page}
```

If no explicit anchor is provided, MDDocs generates one from the heading text.

## Code Blocks {#code-blocks}

Code blocks are highlighted automatically and show a copy button on hover:

```bash
pnpm run build
```

Prefer language tags such as `bash`, `js`, `html`, or `css`.

## Deploy {#deploy}

Build the site:

```bash
pnpm run build
```

Deploy the `dist/` directory to any static hosting platform, such as GitHub Pages, Vercel, Netlify, or your own static file server.
