# 概述

MDDocs 是一个基于 mdui 2、Vue 3、Vite 和 Markdown 的开源文档系统。它适合用来搭建组件库、工具库、框架插件或内部平台的说明文档。

这个项目不是 mdui 组件库本身的使用教程，而是一个已经搭好界面、路由、目录和内容管线的文档站模板。你可以在此基础上替换内容、扩展导航，并发布成自己的开源文档站。

## 适合什么场景 {#use-cases}

- 为开源项目提供中英文文档。
- 用 Markdown 管理可版本化的说明内容。
- 复用 mdui 2 的 Material Design 3 视觉风格。
- 需要左侧导航、右侧目录、章节翻页和代码复制等文档站能力。
- 希望文档内容和站点代码放在同一个仓库中维护。

## 系统包含什么 {#what-is-included}

MDDocs 默认包含以下能力：

- 基于 mdui 2 的 AppBar、侧边栏、目录和卡片式章节导航。
- `src/content/docs` 下的 Markdown 内容组织。
- 中英文路径支持：`/docs` 和 `/zh-cn/docs`。
- 根据页面标题自动生成右侧目录，并在滚动时高亮当前位置。
- 代码块高亮和 hover 复制按钮。
- 移动端抽屉导航、独立滚动和遮罩层处理。
- 明亮、深色和跟随系统的主题切换。

## 内容如何组织 {#content-structure}

文档内容放在 `src/content/docs` 目录中：

```text
src/content/docs/
├── en/
│   ├── introduction.md
│   ├── ai/
│   ├── components/
│   ├── frameworks/
│   ├── functions/
│   └── getting-started/
│       ├── installation.md
│       ├── usage.md
│       ├── project-structure.md
│       └── markdown-content.md
└── zh-cn/
    ├── introduction.md
    ├── ai/
    ├── components/
    ├── frameworks/
    ├── functions/
    └── getting-started/
        ├── installation.md
        ├── usage.md
        ├── project-structure.md
        └── markdown-content.md
```

每个 Markdown 文件会在构建时被 `import.meta.glob` 收集。侧边栏和上一章/下一章顺序由 `src/data/docs.js` 控制，文档路由会根据这份数据自动生成。

## 下一步 {#next}

如果你只是想本地跑起来，请继续阅读 [安装](/zh-cn/docs/getting-started/installation)。

如果你已经启动项目，想开始替换内容，请阅读 [快速入门](/zh-cn/docs/getting-started/usage)。
