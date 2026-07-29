# MDDocs

An open-source documentation system built on mdui 2, Vue 3, Vite, and Markdown.

MDDocs provides a clean mdui-style documentation interface with a Markdown-first content pipeline, localized docs, sticky navigation, page table of contents, and code-copy interactions.

## Features

- Responsive documentation layout for desktop and mobile
- Sticky app bar, sidebar, and page table of contents
- Markdown-based documentation content
- Heading anchors and active table-of-contents highlighting
- Previous and next page navigation
- Code highlighting with a hover copy button
- Light, dark, and system theme switching
- English and Chinese documentation content

## Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [mdui](https://www.mdui.org/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [highlight.js](https://highlightjs.org/)

## Getting Started

### Requirements

- Node.js >= 18
- pnpm >= 8

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm run dev
```

The dev server runs at `http://localhost:3000`.

### Build

```bash
pnpm run build
```

The production output is written to `dist/`.

### Preview

```bash
pnpm run preview
```

## Content

Documentation pages live in `src/content/docs`:

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   └── getting-started/
│       ├── installation.md
│       └── usage.md
└── zh-cn/
    ├── introduction.md
    └── getting-started/
        ├── installation.md
        └── usage.md
```

Markdown files are collected at build time with Vite's `import.meta.glob`. Fenced code blocks are highlighted automatically, and each code block shows a copy button in the top-right corner on hover.

Headings can define explicit anchors:

```md
## Install with pnpm {#install}
```

If no explicit anchor is provided, an id is generated from the heading text.

## Add a Page

1. Add matching Markdown files under `src/content/docs/en` and `src/content/docs/zh-cn`.
2. Add the page entry in `src/data/docs.js` so it appears in the sidebar and previous/next navigation.
3. Add the route in `src/router/index.js` and set `meta.docPath` to the Markdown path without `.md`.

Example route:

```js
{
  path: 'getting-started/new-page',
  name: 'docs-new-page',
  component: MarkdownDoc,
  meta: {
    titleKey: 'docs.newPage',
    docId: 'new-page',
    docPath: 'getting-started/new-page'
  }
}
```

## Project Structure

```text
mddocs/
├── public/
├── src/
│   ├── components/          # shared UI components
│   ├── content/docs/        # Markdown documentation content
│   ├── data/docs.js         # docs sidebar and page order
│   ├── i18n/                # localized UI strings
│   ├── router/              # route definitions
│   ├── styles/main.css      # global styles
│   ├── utils/               # Markdown and highlighting helpers
│   └── views/               # app and docs layouts
├── index.html
├── package.json
└── vite.config.js
```

## Security Notes

Markdown rendering is configured with `html: true`, so raw HTML in docs is allowed (useful for embedding mdui components). Before the result reaches `v-html`, it is sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) (`src/utils/sanitize.js`), which strips scripts and event handlers while allowing `mdui-*` custom elements. If you accept docs content from untrusted contributors, keep this sanitization in place; if you want stricter output, disable `html` in `src/utils/markdown.js`.

## License

MIT License
