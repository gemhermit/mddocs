# MDDocs

一个基于 mdui 2、Vue 3、Vite 和 Markdown 构建的开源文档系统。

MDDocs 提供简洁的 mdui 风格文档界面，采用 Markdown 优先的内容管线，支持多语言文档、粘性导航、页面目录和代码复制交互。

## 功能特性

- 响应式文档布局，适配桌面端和移动端
- 粘性顶栏、侧边栏和页面目录
- 基于 Markdown 的文档内容
- 标题锚点与目录高亮联动
- 上一页 / 下一页导航
- 代码高亮 + 悬停复制按钮
- 亮色、暗色和跟随系统主题切换
- 中英文文档内容

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [mdui](https://www.mdui.org/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
- [highlight.js](https://highlightjs.org/)

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm run dev
```

开发服务器运行在 `http://localhost:3000`。

### 构建

```bash
pnpm run build
```

构建产物输出到 `dist/` 目录。

### 预览

```bash
pnpm run preview
```

## 文档内容

文档页面位于 `src/content/docs` 目录：

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   └── getting-started/
│       ├── installation.md
│       └── usage.md
└── zh-cn/
    ├── introduction.md
    └── getting-started/
        ├── installation.md
        └── usage.md
```

Markdown 文件在构建时通过 Vite 的 `import.meta.glob` 收集。围栏代码块会自动高亮，每个代码块在悬停时右上角会显示复制按钮。

标题支持定义显式锚点：

```md
## 使用 pnpm 安装 {#install}
```

如果未提供显式锚点，将根据标题文本自动生成 id。

## 添加页面

1. 在 `src/content/docs/en` 和 `src/content/docs/zh-cn` 下添加对应的 Markdown 文件。
2. 在 `src/data/docs.js` 中添加页面条目，使其出现在侧边栏和上下页导航中。
3. 在 `src/router/index.js` 中添加路由，并将 `meta.docPath` 设置为不含 `.md` 后缀的 Markdown 路径。

路由示例：

```js
{
  path: 'getting-started/new-page',
  name: 'docs-new-page',
  component: MarkdownDoc,
  meta: {
    titleKey: 'docs.newPage',
    docId: 'new-page',
    docPath: 'getting-started/new-page'
  }
}
```

## 项目结构

```text
mddocs/
├── public/
├── src/
│   ├── components/          # 公共 UI 组件
│   ├── content/docs/        # Markdown 文档内容
│   ├── data/docs.js         # 文档侧边栏与页面排序
│   ├── i18n/                # 多语言 UI 字符串
│   ├── router/              # 路由定义
│   ├── styles/main.css      # 全局样式
│   ├── utils/               # Markdown 和高亮工具函数
│   └── views/               # 应用与文档布局
├── index.html
├── package.json
└── vite.config.js
```

## 开源协议

MIT License
