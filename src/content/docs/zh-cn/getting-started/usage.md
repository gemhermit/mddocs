# 快速入门

这一页介绍如何使用 MDDocs 编写和组织自己的文档内容。

## 修改现有文档 {#edit-docs}

最简单的方式是直接编辑 `src/content/docs` 下的 Markdown 文件。

例如中文快速入门页面位于：

```text
src/content/docs/zh-cn/getting-started/usage.md
```

英文对应页面位于：

```text
src/content/docs/en/getting-started/usage.md
```

保存后，Vite 开发服务器会自动刷新页面。

## 添加新页面 {#add-page}

添加一个页面通常需要三步。

### 1. 添加 Markdown 文件 {#add-markdown}

在中英文目录中分别创建文件：

```text
src/content/docs/en/getting-started/configuration.md
src/content/docs/zh-cn/getting-started/configuration.md
```

页面标题使用 Markdown 一级标题：

```md
# Configuration
```

### 2. 添加侧边栏数据 {#add-sidebar-data}

在 `src/data/docs.js` 中添加页面条目：

```js
{
  id: 'configuration',
  titleKey: 'docs.configuration',
  path: 'getting-started/configuration'
}
```

`path` 会用于生成页面链接和上一章/下一章导航。现在路由会根据这份侧边栏数据自动生成，所以你只需要维护这里，不用再手写 `src/router/index.js` 中的重复配置。

## 添加翻译文案 {#add-i18n}

如果你在侧边栏中使用了新的 `titleKey`，需要在 `src/i18n/index.js` 中补充中英文文案：

```js
docs: {
  configuration: 'Configuration'
}
```

中文部分也需要添加：

```js
docs: {
  configuration: '配置'
}
```

## 设置标题锚点 {#heading-anchors}

二级和三级标题会自动出现在右侧目录中。你可以使用 `{#id}` 指定稳定锚点：

```md
## 添加新页面 {#add-page}
```

如果没有手动指定，系统会根据标题文本自动生成 id。

## 编写代码块 {#code-blocks}

代码块会自动高亮，并在 hover 时显示复制按钮：

```bash
npm run build
```

建议为代码块标注语言，例如 `bash`、`js`、`html` 或 `css`。

## 发布站点 {#deploy}

执行构建命令：

```bash
npm run build
```

将 `dist/` 目录部署到静态站点平台即可。常见选择包括 GitHub Pages、Vercel、Netlify 或任意支持静态文件托管的服务器。
