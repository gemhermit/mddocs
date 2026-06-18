# MDUI Docs

Material Design 3 (Material You) UI component documentation site built with Vue 3, Vite, and mdui Web Components.

This project recreates the MDUI documentation experience with a Markdown-first content pipeline, so the docs can stay readable and easy to maintain in an open-source repository.

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
- npm >= 9

### Install

```bash
npm install
```

### Develop

```bash
npm run dev
```

The dev server runs at `http://localhost:3000`.

### Build

```bash
npm run build
```

The production output is written to `dist/`.

### Preview

```bash
npm run preview
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
## Install with npm {#npm}
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

## License

MIT License
