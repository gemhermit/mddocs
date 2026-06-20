# Deployment

MDDocs builds to static files and can be deployed to GitHub Pages, Vercel, Netlify, Cloudflare Pages, or any static file server.

## Build Output {#build-output}

Run:

```bash
pnpm run build
```

The production output is written to:

```text
dist/
```

Deploy the files inside `dist`.

## Local Preview {#preview}

Preview the production build before publishing:

```bash
pnpm run preview
```

Check the home page, English routes, Chinese routes, code-copy buttons, and mobile drawer behavior.

## GitHub Pages Example {#github-pages}

For GitHub Pages, a CI job usually runs:

```bash
pnpm install --frozen-lockfile
pnpm run build
```

Then publish the `dist` folder to Pages.

If your site is hosted under a subpath, review the Vite `base` option. When deploying to the domain root, the default is usually fine.

## Release Checklist {#checklist}

Before publishing, confirm that:

- Every sidebar item opens a page.
- Both English and Chinese pages have content.
- Page titles and browser titles are correct.
- External links, GitHub links, and feedback links point to your project.
- `pnpm run build` passes consistently.

