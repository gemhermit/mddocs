# Project Structure

MDDocs keeps the project easy to reason about: content lives in Markdown, navigation lives in data, and layout behavior lives in Vue components.

## Core Folders {#core-folders}

The most important folders are:

```text
src/
├── components/        # Shared components such as AppBar, Sidebar, and Footer
├── content/docs/      # English and Chinese Markdown docs
├── data/docs.js       # Sidebar sections and document order
├── i18n/index.js      # UI labels and translated menu titles
├── router/index.js    # Routes generated from docs.js
├── styles/main.css    # Global styles, docs typography, and responsive layout
├── utils/markdown.js  # Markdown rendering, heading anchors, and code wrappers
└── views/docs/        # Docs layout and Markdown rendering views
```

## Content Folder {#content-folder}

Documentation content lives in `src/content/docs`, grouped by locale:

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   └── getting-started/
└── zh-cn/
    ├── introduction.md
    └── getting-started/
```

Keep matching pages at the same path in both languages:

```text
src/content/docs/en/ai/overview.md
src/content/docs/zh-cn/ai/overview.md
```

This makes language switching predictable and helps maintainers spot missing translations.

## Navigation Data {#navigation-data}

The sidebar is controlled by `src/data/docs.js`. Each page entry looks like this:

```js
{
  id: 'ai-overview',
  titleKey: 'docs.aiOverview',
  path: 'ai/overview'
}
```

- `id` identifies the active page and previous/next navigation.
- `titleKey` maps to translated labels in `src/i18n/index.js`.
- `path` maps to the Markdown file path without `.md`.

## Route Generation {#routes}

Docs routes are generated from `docsPages`. In most cases, adding an entry in `src/data/docs.js` is enough.

When `path` is `ai/overview`, the page is available at:

```text
/docs/2/ai/overview
/zh-cn/docs/2/ai/overview
```

## Maintenance Checklist {#maintenance}

When adding a page, check these steps:

1. Add the English and Chinese Markdown files.
2. Add the sidebar entry in `src/data/docs.js`.
3. Add translated labels in `src/i18n/index.js`.
4. Run `pnpm run build` to catch missing files or syntax errors.

