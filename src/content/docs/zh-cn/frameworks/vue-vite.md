# Vue 与 Vite

MDDocs 基于 Vue 3 和 Vite 构建。Vue 负责组件化界面，Vite 负责开发服务器、模块加载和生产构建。

## 为什么使用 Vue {#why-vue}

Vue 适合文档站的几个原因：

- 组件拆分清晰，AppBar、Sidebar、Footer 可以独立维护。
- 响应式状态适合处理语言、主题、目录高亮和抽屉状态。
- 与 Vue Router 配合可以轻松管理中英文路径。

## Markdown 加载方式 {#markdown-loading}

Markdown 文件通过 `import.meta.glob` 在构建时收集：

```js
const markdownModules = import.meta.glob('../../content/docs/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})
```

这样每个 Markdown 文件都会作为字符串进入构建产物，再由 `markdown-it` 渲染成 HTML。

## 路由布局 {#router-layout}

文档页共用 `DocsLayout.vue`，正文由 `MarkdownDoc.vue` 渲染。侧边栏和右侧目录都在布局层处理。

这种结构让每个 Markdown 页面只关心内容，不需要重复写页面壳。

## 开发体验 {#developer-experience}

启动开发服务后：

```bash
pnpm run dev
```

修改 Vue 组件、CSS 或 Markdown 文件都会触发热更新。新增文件后如果页面没有出现，可以重启 dev server 让 Vite 重新收集模块。

