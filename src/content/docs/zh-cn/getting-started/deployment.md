# 部署发布

MDDocs 构建后是静态站点，可以部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages 或任意静态文件服务器。

## 构建产物 {#build-output}

执行：

```bash
pnpm run build
```

构建产物会输出到：

```text
dist/
```

部署时只需要上传 `dist` 目录中的静态文件。

## 本地预览 {#preview}

发布前建议先预览生产产物：

```bash
pnpm run preview
```

确认首页、中文路径、英文路径、代码复制按钮和移动端抽屉都能正常工作。

## GitHub Pages 示例 {#github-pages}

如果使用 GitHub Pages，可以在 CI 中执行：

```bash
pnpm install --frozen-lockfile
pnpm run build
```

然后将 `dist` 目录发布到 Pages。

如果站点部署在子路径下，需要检查 Vite 的 `base` 配置。部署在域名根路径时通常不需要修改。

## 发布检查清单 {#checklist}

发布前建议确认：

- 所有侧边栏条目都能打开。
- 中英文页面都存在内容。
- 页面标题和浏览器标题正确。
- 外链、GitHub 链接和反馈入口指向自己的项目。
- `pnpm run build` 可以稳定通过。

