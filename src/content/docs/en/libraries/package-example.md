# Package Example

If your project contains multiple packages, package docs can explain installation, entry points, bundle size, and use cases for each package.

## Positioning {#positioning}

Assume the project provides a standalone Markdown helper package:

```text
@mddocs/markdown
```

It parses heading anchors, wraps code blocks, and outputs HTML suitable for a documentation site.

## Installation {#installation}

```bash
pnpm install @mddocs/markdown
```

## Usage {#usage}

```ts
import { renderMarkdown } from '@mddocs/markdown'

const html = renderMarkdown('# Hello')
```

## API {#api}

| Name | Type | Description |
| --- | --- | --- |
| `renderMarkdown` | `(source: string) => string` | Render Markdown to HTML |
| `extractHeadings` | `(html: string) => Heading[]` | Extract table of contents headings |

## Versioning {#versioning}

Package docs should explain:

- Supported Node.js versions.
- Whether ESM and CommonJS are supported.
- Whether package versions follow the main project.
- How breaking changes are documented.

