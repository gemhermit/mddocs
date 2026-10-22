# MDDocs

An open-source documentation system built on mdui 2, Vue 3, Vite, and Markdown.

MDDocs provides a clean mdui-style documentation interface with a Markdown-first content pipeline, localized docs, sticky navigation, page table of contents, and code-copy interactions.

## Features

- Responsive documentation layout for desktop and mobile
- Sticky app bar, sidebar, and page table of contents
- Markdown-based documentation content
- Heading anchors and active table-of-contents highlighting
- Shareable section anchors (the URL keeps the `#anchor` you navigated to)
- Previous and next page navigation
- Code highlighting with a hover copy button
- Light, dark, and system theme switching
- English and Chinese documentation content
- Static prerendering, sitemap, robots.txt, and `llms.txt` for SEO and LLM tooling
- Keyboard-friendly "skip to content" link

## Tech Stack

Runtime (shipped to the browser):

- [Vue 3](https://vuejs.org/)
- [Vite](https://vite.dev/)
- [Vue Router](https://router.vuejs.org/)
- [mdui](https://www.mdui.org/)

Build time only (never reaches the browser bundle):

- [markdown-it](https://github.com/markdown-it/markdown-it) — renders Markdown
- [highlight.js](https://highlightjs.org/) — highlights code blocks
- [DOMPurify](https://github.com/cure53/DOMPurify) + [jsdom](https://github.com/jsdom/jsdom) — sanitizes the rendered HTML

## Getting Started

### Requirements

- Node.js >= 22.23.4
- pnpm >= 8

`22.23.4` is the first release that carries every published runtime security fix; older 20.x/22.x builds are still affected. `engine-strict` is enabled in `.npmrc`, so installing on an affected runtime fails fast instead of silently warning. A `.nvmrc` is included for `nvm use`.

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm run dev
```

The dev server runs at `http://localhost:3000`.

### Scripts

| Script | What it does |
| --- | --- |
| `pnpm run dev` | Start the Vite dev server |
| `pnpm run build` | Generate sitemap/robots/llms files, render the Markdown content, build the site, and prerender every route |
| `pnpm run build:gh` | Same as `build`, but with the `/mddocs/` base path for GitHub Pages |
| `pnpm run build:fast` | Build without prerendering (faster iteration) |
| `pnpm run build:content` | Only re-render the Markdown content into `src/content/generated/` |
| `pnpm run preview` | Serve the production build locally |
| `pnpm run lint` | Run ESLint over the whole project |
| `pnpm run check:docs` | Verify bilingual content parity and prerendered output |
| `pnpm run check:icons` | Verify every icon used in the code exists in the subset font |
| `pnpm run icons:subset` | Regenerate the subset icon fonts (needs `python3` + `fonttools`) |
| `pnpm run check` | `check:docs` + `check:icons` + `lint` + `build`, the same sequence CI runs |

### Build

```bash
pnpm run build
```

The production output is written to `dist/`.

## Environment Variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `SITE_URL` | Canonical origin used for `canonical`, `og:url`, `hreflang`, sitemap and `robots.txt` | `https://mddocs.bago.top` |
| `BASE_URL` | Vite `base` and router base; use a sub-path when deploying under one | `/` |

`SITE_URL` must not have a trailing slash and should match the final access URL. Both the browser bundle and the build scripts read the same variable, so set it once in your deployment platform.

## Continuous Integration

- `.github/workflows/ci.yml` runs lint, the bilingual content check, the production build, the prerender check and a production dependency audit on every push and pull request.
- `.github/workflows/deploy.yml` publishes the site to GitHub Pages. Enable it once in **Settings → Pages → Source: GitHub Actions**, then run it manually (or uncomment the `push` trigger to publish on every merge to `main`).

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

Markdown is rendered at build time, not in the browser. `scripts/build-content.mjs` turns every page into HTML, generates heading ids, highlights code blocks, sanitizes the result, and writes it to `src/content/generated/`; the browser only loads the small chunk holding its own page. The search index is built the same way, one file per language, so opening the search fetches a single file instead of every document.

Fenced code blocks are highlighted automatically, and each code block shows a copy button in the top-right corner on hover.

Headings can define explicit anchors:

```md
## Install with pnpm {#install}
```

If no explicit anchor is provided, an id is generated from the heading text.

## Add a Page

1. Add matching Markdown files under `src/content/docs/en` and `src/content/docs/zh-cn`.
2. Add the page entry in `src/data/docs.js` so it appears in the sidebar and previous/next navigation.
3. Add the translated title in `src/i18n/messages.js`.

Routes are generated from `src/data/docs.js`, so there is no route file to edit. `pnpm run check:docs` fails the build when a registered page is missing one of the two languages, when an unregistered Markdown file is left behind, or when the prerendered output does not cover every route.

## Project Structure

```text
mddocs/
├── .github/workflows/       # CI and GitHub Pages deployment
├── public/                  # static assets copied verbatim (favicon, og image, manifest)
├── scripts/                 # build-time tooling: content, sitemap, prerender, checks
├── src/
│   ├── components/          # shared UI components
│   ├── content/docs/        # Markdown documentation content
│   ├── content/generated/   # build output: pre-rendered HTML + search indexes (not tracked)
│   ├── data/docs.js         # docs sidebar and page order
│   ├── i18n/                # localized UI strings
│   ├── router/              # route definitions
│   ├── styles/main.css      # global styles
│   ├── utils/               # site paths, navigation, code helpers
│   └── views/               # app and docs layouts
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

## Icon Fonts

The Material Icons fonts are self-hosted and **subset to the icons this site actually uses** (295 KB → 3.9 KB; Vite inlines them into the CSS, so they cost no extra request).

If you add an icon, regenerate the subset afterwards — otherwise the browser has no glyph for it and the icon renders as literal text:

```bash
pip install fonttools brotli   # one-time setup
pnpm run icons:subset
```

`pnpm run check:icons` (part of `pnpm run check` and CI) compares the icons used in the code against the generated manifest, so a forgotten regeneration fails the build instead of silently breaking a page.

## Generated Files

`public/sitemap.xml`, `public/robots.txt`, `public/llms.txt` and `public/llms-full.txt` are build artifacts: they are regenerated on every build and are intentionally **not** tracked by git. `llms-full.txt` contains the full page source of every page so LLM tooling can read the documentation without scraping the site.

## Security Notes

Markdown rendering happens at build time (`scripts/lib/`): the generated HTML is sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) before it is written to disk, which strips scripts and event handlers while allowing `mdui-*` custom elements. The browser bundle therefore does not ship a Markdown renderer or a sanitizer. If you accept docs content from untrusted contributors, keep the build-time sanitization in place.

## License

MIT License
