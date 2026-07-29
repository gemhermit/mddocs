# Deployment

MDDocs builds to static files and can be deployed to Vercel, Cloudflare Pages, GitHub Pages, Netlify, or any static file server.

## Build Output {#build-output}

Run:

```bash
pnpm run build
```

The production output is written to:

```text
dist/
```

Deploy the files inside `dist`. The build process also generates prerendered HTML, sitemap, robots.txt, and llms.txt.

## Environment Variables {#environment-variables}

Configure two environment variables before deploying:

| Variable | Purpose | Example |
| --- | --- | --- |
| `SITE_URL` | Base URL for sitemap, canonical, and hreflang tags | `https://example.com` |
| `BASE_URL` | Vite `base` option, affects asset path prefix | `/` or `/repo-name/` |

When deploying to the domain root, set `BASE_URL` to `/` (the default, can be omitted). When deploying under a subpath, set it to `/repo-name/`. `SITE_URL` must not have a trailing slash and should match the final access URL.

## Local Preview {#preview}

Preview the production build before publishing:

```bash
pnpm run preview
```

Check the home page, English routes, Chinese routes, code-copy buttons, and mobile drawer behavior.

## Vercel {#vercel}

Vercel auto-detects Vite projects, so extra configuration is usually unnecessary. If a `vercel.json` exists in the repository root, Vercel reads the build command and routing rules from it.

1. Push your code to GitHub or GitLab.
2. Go to [vercel.com](https://vercel.com), click "Add New Project", and import the repository.
3. Under Environment Variables, add `SITE_URL` set to the Vercel-assigned domain, e.g. `https://your-project.vercel.app`. If you have a custom domain, use that instead.
4. Click Deploy.

To override the configuration manually, the `vercel.json` in the project root looks like this:

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The `rewrites` rule ensures all paths fall back to `index.html`, letting Vue Router handle client-side routing.

## Cloudflare Pages {#cloudflare-pages}

1. Push your code to a Git repository.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com), go to Workers & Pages, and click "Create application".
3. Connect the Git repository and fill in the build configuration:

   ```text
   Framework preset: None
   Build command: pnpm run build
   Build output directory: dist
   ```

4. Under Environment variables, add `SITE_URL` set to the Cloudflare Pages domain, e.g. `https://your-project.pages.dev`.
5. Click "Save and Deploy".

Cloudflare Pages configures SPA fallback rules automatically. If you encounter 404 errors on refresh, add a `public/_redirects` file to the project root:

```text
/*  /index.html  200
```

## GitHub Pages {#github-pages}

GitHub Pages is typically hosted under a subpath like `https://username.github.io/repo-name/`, which requires setting `BASE_URL`.

The project includes a `build:gh` script that automatically sets `BASE_URL=/mddocs/`:

```bash
pnpm run build:gh
```

If your repository name is not `mddocs`, update the `build:gh` script in `package.json` to replace `/mddocs/` with `/<your-repo-name>/`.

### Automatic deployment with GitHub Actions {#github-actions}

Create `.github/workflows/deploy.yml` in your repository:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build:gh
        env:
          SITE_URL: https://username.github.io/repo-name
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Replace `username` and `repo-name` with your actual values. Then go to Settings → Pages in your repository and set Source to "GitHub Actions".

If deploying to a custom domain at the root path, use `pnpm run build` instead of `pnpm run build:gh` and set `SITE_URL` to the custom domain.

## Netlify {#netlify}

1. Push your code to a Git repository.
2. Log in to [netlify.com](https://app.netlify.com), click "Add new site", and import the repository.
3. In Build settings, fill in:

   ```text
   Build command: pnpm run build
   Publish directory: dist
   ```

4. Under Environment variables, add `SITE_URL` set to the Netlify-assigned domain, e.g. `https://your-project.netlify.app`.
5. Click "Deploy site".

Add a `public/_redirects` file to the project root to handle SPA routing:

```text
/*  /index.html  200
```

## Other Static Servers {#other-servers}

For traditional servers like Nginx or Apache, configure SPA fallback rules manually.

### Nginx {#nginx}

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache {#apache}

Create a `.htaccess` file in the `dist` directory:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

## Release Checklist {#checklist}

Before publishing, confirm that:

- Every sidebar item opens a page.
- Both English and Chinese pages have content.
- Page titles and browser titles are correct.
- External links, GitHub links, and feedback links point to your project.
- The `SITE_URL` environment variable matches the actual access domain, otherwise sitemap and canonical links will point to the wrong address.
- Refreshing any subpage does not return a 404.
- `pnpm run build` passes consistently.
