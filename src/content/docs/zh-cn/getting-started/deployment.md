# 部署发布

MDDocs 构建后是纯静态站点，可以部署到 Vercel、Cloudflare Pages、GitHub Pages、Netlify 或任意静态文件服务器。

## 构建产物 {#build-output}

执行：

```bash
pnpm run build
```

构建产物会输出到：

```text
dist/
```

部署时只需要上传 `dist` 目录中的静态文件。构建过程会同时生成预渲染的 HTML、sitemap、robots.txt 和 llms.txt。

## 环境变量 {#environment-variables}

部署前需要配置两个环境变量：

| 变量 | 作用 | 示例 |
| --- | --- | --- |
| `SITE_URL` | sitemap、canonical、hreflang 的基础 URL | `https://example.com` |
| `BASE_URL` | Vite 的 `base` 配置，影响资源路径前缀 | `/` 或 `/repo-name/` |

部署在域名根路径时 `BASE_URL` 设为 `/`（默认值，可省略）；部署在子路径下时设为 `/repo-name/`。`SITE_URL` 不带尾部斜杠，且应与最终访问地址一致。

## 本地预览 {#preview}

发布前建议先预览生产产物：

```bash
pnpm run preview
```

确认首页、中文路径、英文路径、代码复制按钮和移动端抽屉都能正常工作。

## Vercel {#vercel}

Vercel 会自动识别 Vite 项目，通常不需要额外配置。如果仓库根目录已有 `vercel.json`，Vercel 会读取其中的构建命令和路由规则。

1. 将代码推送到 GitHub 或 GitLab。
2. 在 [vercel.com](https://vercel.com) 中点击 "Add New Project"，导入仓库。
3. 在 Environment Variables 中添加 `SITE_URL`，值设为 Vercel 分配的域名，例如 `https://your-project.vercel.app`。如果绑定了自定义域名，改为自定义域名。
4. 点击 Deploy。

如果需要手动覆盖配置，项目根目录的 `vercel.json` 内容如下：

```json
{
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

`rewrites` 规则确保所有路径都回退到 `index.html`，由 Vue Router 接管客户端路由。

## Cloudflare Pages {#cloudflare-pages}

1. 将代码推送到 Git 仓库。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)，进入 Workers & Pages，点击 "Create application"。
3. 连接 Git 仓库，在构建配置中填写：

   ```text
   Framework preset: None
   Build command: pnpm run build
   Build output directory: dist
   ```

4. 在 Environment variables 中添加 `SITE_URL`，值设为 Cloudflare Pages 分配的域名，例如 `https://your-project.pages.dev`。
5. 点击 "Save and Deploy"。

Cloudflare Pages 会自动为 SPA 配置回退规则。如果遇到刷新 404 的问题，在项目根目录添加 `public/_redirects` 文件：

```text
/*  /index.html  200
```

## GitHub Pages {#github-pages}

GitHub Pages 通常部署在 `https://username.github.io/repo-name/` 子路径下，需要设置 `BASE_URL`。

项目已内置 `build:gh` 脚本，会自动设置 `BASE_URL=/mddocs/`：

```bash
pnpm run build:gh
```

如果你的仓库名不是 `mddocs`，需要修改 `package.json` 中的 `build:gh` 脚本，将 `/mddocs/` 替换为 `/<你的仓库名>/`。

### 通过 GitHub Actions 自动部署 {#github-actions}

在仓库中创建 `.github/workflows/deploy.yml`：

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

将 `username` 和 `repo-name` 替换为你的实际值。然后在仓库 Settings → Pages 中将 Source 设为 "GitHub Actions"。

如果部署在自定义域名的根路径，使用 `pnpm run build` 代替 `pnpm run build:gh`，并将 `SITE_URL` 设为自定义域名。

## Netlify {#netlify}

1. 将代码推送到 Git 仓库。
2. 登录 [netlify.com](https://app.netlify.com)，点击 "Add new site"，导入仓库。
3. 在 Build settings 中填写：

   ```text
   Build command: pnpm run build
   Publish directory: dist
   ```

4. 在 Environment variables 中添加 `SITE_URL`，值设为 Netlify 分配的域名，例如 `https://your-project.netlify.app`。
5. 点击 "Deploy site"。

在项目根目录添加 `public/_redirects` 文件处理 SPA 路由：

```text
/*  /index.html  200
```

## 其他静态服务器 {#other-servers}

对于 Nginx、Apache 等传统服务器，需要手动配置 SPA 回退规则。

### Nginx {#nginx}

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Apache {#apache}

在 `dist` 目录下创建 `.htaccess`：

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /index.html [L]
```

## 发布检查清单 {#checklist}

发布前建议确认：

- 所有侧边栏条目都能打开。
- 中英文页面都存在内容。
- 页面标题和浏览器标题正确。
- 外链、GitHub 链接和反馈入口指向自己的项目。
- `SITE_URL` 环境变量与实际访问域名一致，否则 sitemap 和 canonical 链接会指向错误地址。
- 刷新任意子页面不会出现 404。
- `pnpm run build` 可以稳定通过。
