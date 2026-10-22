# Project Structure

MDDocs keeps the project easy to reason about: content lives in Markdown, navigation lives in data, and layout behavior lives in Vue components.

## Core Folders {#core-folders}

The most important folders are:

```text
src/
├── components/        # Shared components such as AppBar, Sidebar, and TocList
├── content/docs/      # English and Chinese Markdown docs
├── content/generated/ # Build output: pre-rendered HTML and search indexes (generated)
├── data/docs.js       # Sidebar sections and document order
├── i18n/index.js      # UI labels and translated menu titles
├── router/index.js    # Routes generated from docs.js
├── styles/main.css    # Global styles, docs typography, and responsive layout
├── utils/             # Shared helpers used by both the browser and the build
└── views/docs/        # Docs layout and Markdown rendering views

scripts/
├── build-content.mjs  # Renders Markdown into HTML + search indexes
├── lib/               # Build-time Markdown rendering, sanitizing, index building
├── generate-sitemap.mjs
└── prerender.mjs      # Writes per-route HTML and 404.html into dist/
```

## Build Pipeline {#build-pipeline}

Markdown is rendered at build time, not in the browser:

```text
src/content/docs/**/*.md
  → scripts/build-content.mjs
  → src/content/generated/pages/<locale>/<page>.js   (HTML + heading list)
  → src/content/generated/search/<locale>.js          (search index)
  → vite build → dist/assets/*.js
  → scripts/prerender.mjs → dist/**/index.html + dist/404.html
```

Because rendering, syntax highlighting, and sanitizing happen during the build,
the browser bundle does not include `markdown-it`, `highlight.js`, or
`DOMPurify`. The page only loads the small chunk holding its own HTML.

`src/content/generated/` is generated output and is not committed. Run
`pnpm run build:content` to regenerate it alone, or `pnpm run build` for the
full pipeline.

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
/docs/ai/overview
/zh-cn/docs/ai/overview
```

## Maintenance Checklist {#maintenance}

When adding a page, check these steps:

1. Add the English and Chinese Markdown files.
2. Add the sidebar entry in `src/data/docs.js`.
3. Add translated labels in `src/i18n/index.js`.
4. Run `pnpm run build` to catch missing files or syntax errors.
