# 项目结构

MDDocs 的目录设计尽量保持直观：内容放在 Markdown 中，导航放在数据文件中，布局和交互放在 Vue 组件中。

## 核心目录 {#core-folders}

常用目录如下：

```text
src/
├── components/        # AppBar、Sidebar、TocList 等公共组件
├── content/docs/      # 中英文 Markdown 文档内容
├── content/generated/ # 构建产物：预渲染 HTML 与搜索索引（自动生成）
├── data/docs.js       # 左侧侧边栏和文档顺序
├── i18n/index.js      # 界面文案和菜单标题翻译
├── router/index.js    # 页面路由，根据 docs.js 自动生成文档路由
├── styles/main.css    # 全局样式、文档排版和响应式布局
├── utils/             # 浏览器与构建脚本共用的工具函数
└── views/docs/        # 文档布局和 Markdown 渲染视图

scripts/
├── build-content.mjs  # 把 Markdown 渲染成 HTML 与搜索索引
├── lib/               # 构建期的 Markdown 渲染、消毒、索引生成
├── generate-sitemap.mjs
└── prerender.mjs      # 往 dist/ 写入各路由的 HTML 与 404.html
```

## 构建流程 {#build-pipeline}

Markdown 在构建期完成渲染，浏览器端不再解析 Markdown：

```text
src/content/docs/**/*.md
  → scripts/build-content.mjs
  → src/content/generated/pages/<locale>/<page>.js   （HTML + 标题列表）
  → src/content/generated/search/<locale>.js          （搜索索引）
  → vite build → dist/assets/*.js
  → scripts/prerender.mjs → dist/**/index.html + dist/404.html
```

由于渲染、语法高亮和消毒都在构建期完成，浏览器包里不再包含 `markdown-it`、
`highlight.js` 和 `DOMPurify`，页面只需要加载自己那一小份 HTML。

`src/content/generated/` 是构建产物，不纳入版本管理。只想重新生成内容时执行
`pnpm run build:content`，完整构建用 `pnpm run build`。

## 内容目录 {#content-folder}

文档正文位于 `src/content/docs`，按语言拆分：

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   └── getting-started/
└── zh-cn/
    ├── introduction.md
    └── getting-started/
```

同一个页面建议中英文路径保持一致，例如：

```text
src/content/docs/en/ai/overview.md
src/content/docs/zh-cn/ai/overview.md
```

这样切换语言时，用户更容易理解对应关系，也方便维护者检查内容是否缺失。

## 导航数据 {#navigation-data}

左侧菜单由 `src/data/docs.js` 控制。每个条目包含：

```js
{
  id: 'ai-overview',
  titleKey: 'docs.aiOverview',
  path: 'ai/overview'
}
```

- `id` 用于识别当前页面和上一章/下一章。
- `titleKey` 对应 `src/i18n/index.js` 中的菜单文案。
- `path` 对应 Markdown 文件路径，不需要 `.md` 后缀。

## 路由生成 {#routes}

文档路由会根据 `docsPages` 自动生成。通常只需要维护 `src/data/docs.js`，不需要为每个 Markdown 页面手动写路由。

当 `path` 是 `ai/overview` 时，对应访问地址为：

```text
/docs/ai/overview
/zh-cn/docs/ai/overview
```

## 推荐维护方式 {#maintenance}

新增页面时建议按这个顺序检查：

1. 添加中英文 Markdown 文件。
2. 在 `src/data/docs.js` 中加入侧边栏条目。
3. 在 `src/i18n/index.js` 中加入标题翻译。
4. 运行 `pnpm run build` 确认没有缺失或语法错误。

