# Markdown Content

MDDocs uses Markdown as the primary content format so documentation can be reviewed, searched, versioned, and maintained like source code.

## Rendering Pipeline {#rendering-pipeline}

Markdown is rendered during the build, not in the browser:

- `scripts/build-content.mjs` renders every page to HTML, generates heading ids, highlights code blocks, and sanitizes the result with DOMPurify.
- The result is written to `src/content/generated/` and shipped as one small chunk per page.
- The browser only inserts that HTML, so no Markdown parser is shipped to visitors.

Because of this, raw HTML inside a Markdown file is sanitized once at build time, and the pre-rendered page and the client-rendered page always stay identical.

## Page Title {#page-title}

Each page should usually have one top-level heading:

```md
# Page Title
```

The top-level heading starts the page. The right-side table of contents is generated from second- and third-level headings.

## Heading Anchors {#heading-anchors}

You can define stable heading anchors:

```md
## Install Dependencies {#install-dependencies}
```

When no `{#id}` is provided, MDDocs generates an id from the heading text. Add explicit ids for headings that external pages may link to.

## Links {#links}

Internal links can use absolute paths:

```md
[Installation](/docs/getting-started/installation)
```

The matching Chinese route is:

```md
[安装](/zh-cn/docs/getting-started/installation)
```

## Code Blocks {#code-blocks}

Code blocks are highlighted automatically and show a copy button on hover:

```bash
pnpm run build
```

Always include a language when possible:

~~~md
```js
export const siteName = 'MDDocs'
```
~~~

## Writing Style {#writing-style}

When writing docs:

- Keep each page focused on one clear topic.
- Use short paragraphs for context and code blocks for actions.
- Prefer real paths, real commands, and runnable examples.
- Let previous/next navigation connect pages instead of repeating manual links everywhere.
