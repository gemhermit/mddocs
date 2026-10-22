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

同一个 `SITE_URL` 变量同时决定构建脚本和浏览器端的 canonical / hreflang，在部署平台里配置一次即可。完全不设置时，规范地址默认使用 `https://mddocs.bago.top`。

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
  "outputDirectory": "dist"
}
```

所有路由都会预渲染成独立的 HTML 文件，因此不需要 catch-all 回退规则。不写这条规则对 404 页面同样重要：`/(.*)` → `/index.html` 会让所有未知路径都返回 200 状态码，搜索引擎会把这些页面当成首页的重复内容。去掉之后，Vercel 会用真正的 404 状态码返回生成的 `404.html`，再由站内的 404 页面接管。

## 减少构建次数 {#build-frequency}

每次往生产分支推送都会触发一次 Vercel 部署，而每次部署都要跑一遍完整构建：渲染全部页面、打包、预渲染。日常改动 —— 改 README 的错字、调 CI 参数、跟同伴对齐说明 —— 并不需要发版。

在 Vercel 控制台一次性开启 **Ignored Build Step**：

1. 打开 [vercel.com](https://vercel.com) 上的项目，进入 **Settings → Build and Deployment**。
2. 把 **Ignored Build Step** 填成 `npm run vercel-ignore`。
3. 保存。

之后每次推送由脚本判定：

| 改动内容 | 结果 |
| --- | --- |
| 只涉及不影响站点产物的文件（README、LICENSE、CI 工作流、ESLint 配置） | 跳过构建 |
| 提交信息里带 `[skip deploy]` | 跳过构建 |
| 其他情况（源码、文档正文、脚本、依赖、`vercel.json`） | 正常构建并部署 |

推送前可以先在本地看一眼判定结果：

```bash
node scripts/vercel-ignore.mjs HEAD     # 0 = 会跳过，1 = 会构建
node scripts/vercel-ignore.mjs --self-test
```

退出码与 Vercel 的约定一致：`0` 跳过构建，其他值继续构建。

> 把相关的改动合成一个提交、一次推送即可 —— 一次推送里包含多个提交也只会构建一次。Pull Request 同理，它会产生 preview 部署。

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

所有路由都已预渲染，不需要 `_redirects` 文件。Cloudflare Pages 会用真正的 404 状态码返回生成的 `404.html`。如果以后新增了不预渲染的纯客户端路由，再加一条指向 `404.html` 的兜底（不要指向 `index.html`）：

```text
/*  /404.html  404
```

## GitHub Pages {#github-pages}

GitHub Pages 通常部署在 `https://username.github.io/repo-name/` 子路径下，需要设置 `BASE_URL`。

项目已内置 `build:gh` 脚本，会自动设置 `BASE_URL=/mddocs/`：

```bash
pnpm run build:gh
```

如果你的仓库名不是 `mddocs`，需要修改 `package.json` 中的 `build:gh` 脚本，将 `/mddocs/` 替换为 `/<你的仓库名>/`。

### 通过 GitHub Actions 自动部署 {#github-actions}

本仓库已经内置了 `.github/workflows/deploy.yml`：在仓库 **Settings → Pages** 里把 Source 设为 "GitHub Actions"，然后到 Actions 页手动运行即可发布；想改成合并到 `main` 自动发布，把工作流里注释掉的 `push` 触发器打开。工作流会自动带上子路径 `BASE_URL` 和对应的 `SITE_URL`：

```yaml
name: Deploy to GitHub Pages

on:
  workflow_dispatch:
  # push:
  #   branches: [main]

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
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
        env:
          BASE_URL: /${{ github.event.repository.name }}/
          SITE_URL: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}
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

工作流会根据仓库名自动推导子路径与站点地址，无需手动替换。然后在仓库 Settings → Pages 中将 Source 设为 "GitHub Actions"。

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
/*  /404.html  404
```

所有路由都已预渲染，Netlify 本身就会用真正的 404 状态码返回生成的 `404.html`。上面这条规则只在新增了不预渲染的纯客户端路由时才需要 —— 指向 `404.html` 而不是 `index.html`，否则未知路径会返回 200 状态码，被搜索引擎当成首页的重复内容收录。

## 其他静态服务器 {#other-servers}

对于 Nginx、Apache 等传统服务器，未知路径应指向生成的 `404.html` 而不是 `index.html`，这样响应才能保持真正的 404 状态码。

### Nginx {#nginx}

```nginx
location / {
  try_files $uri $uri/ /404.html;
}
```

### Apache {#apache}

在 `dist` 目录下创建 `.htaccess`：

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ /404.html [L]

ErrorDocument 404 /404.html
```

## 404 页面 {#not-found}

构建产物里还会生成 `dist/404.html`，访问不存在的路径时会渲染站内的 404 页面，而不是服务器自带的报错页。

- GitHub Pages 会自动使用 `404.html`（并返回真正的 404 状态码）。
- Vercel、Netlify、Cloudflare Pages 同样会自动使用 `404.html`（前提是**不要**配置指向 `index.html` 的 catch-all 回退规则）。
- Nginx / Apache 需要把错误页指向这个文件，避免状态码变成 200：

```nginx
error_page 404 /404.html;
```

```apache
ErrorDocument 404 /404.html
```

回退到 `index.html` 且状态码为 200 的情况属于"软 404"：搜索引擎会把它当成首页的重复内容，所以平台允许时务必让未知路径返回真正的 404 状态码。

## 发布检查清单 {#checklist}

发布前建议确认：

- 所有侧边栏条目都能打开。
- 中英文页面都存在内容。
- 页面标题和浏览器标题正确。
- 外链、GitHub 链接和反馈入口指向自己的项目。
- `SITE_URL` 环境变量与实际访问域名一致，否则 sitemap 和 canonical 链接会指向错误地址。
- 刷新任意子页面不会出现 404。
- `pnpm run build` 可以稳定通过。
