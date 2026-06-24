# Introduction

MDDocs is an open-source documentation system built with mdui 2, Vue 3, Vite, and Markdown. It is designed for component libraries, toolkits, framework plugins, and internal platform docs.

This project is not the mdui component library documentation itself. It is a ready-to-customize documentation site with layout, routes, navigation, table of contents, and a Markdown content pipeline already wired up.

## Use Cases {#use-cases}

- Publish bilingual documentation for an open-source project.
- Keep documentation content readable and versionable in Markdown.
- Reuse the Material Design 3 visual language from mdui 2.
- Use built-in sidebar navigation, page table of contents, previous/next links, and code-copy interactions.
- Maintain docs content and site code in the same repository.

## What Is Included {#what-is-included}

MDDocs includes:

- App bar, sidebar, page table of contents, and bottom navigation built with mdui 2.
- Markdown content under `src/content/docs`.
- English and Chinese routes: `/docs` and `/zh-cn/docs`.
- Automatic table of contents generation from page headings.
- Active heading highlighting while scrolling.
- Code highlighting and hover copy buttons.
- Mobile drawer navigation with independent scrolling.
- Light, dark, and system theme switching.

## Content Structure {#content-structure}

Documentation content lives in `src/content/docs`:

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   ├── ai/
│   ├── components/
│   ├── frameworks/
│   ├── functions/
│   └── getting-started/
│       ├── installation.md
│       ├── usage.md
│       ├── project-structure.md
│       └── markdown-content.md
└── zh-cn/
    ├── introduction.md
    ├── ai/
    ├── components/
    ├── frameworks/
    ├── functions/
    └── getting-started/
        ├── installation.md
        ├── usage.md
        ├── project-structure.md
        └── markdown-content.md
```

Markdown files are collected at build time with `import.meta.glob`. Sidebar order and previous/next navigation are controlled by `src/data/docs.js`, and docs routes are generated from that data.

## Next Steps {#next}

To run the project locally, continue with [Installation](/docs/getting-started/installation).

To start replacing content and adding pages, read [Usage](/docs/getting-started/usage).
