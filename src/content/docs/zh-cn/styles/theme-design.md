# 主题设计

MDDocs 的视觉基础来自 mdui 2 和 Material Design 3。你可以保留默认风格，也可以逐步替换成自己项目的品牌色和排版节奏。

## 全局样式入口 {#style-entry}

全局样式位于：

```text
src/styles/main.css
```

常见修改包括：

- 页面背景色。
- 文档正文最大宽度。
- 代码块样式。
- 侧边栏、目录和底部导航间距。
- 移动端断点布局。

## 颜色策略 {#colors}

项目使用 mdui 的 CSS 变量来保持浅色和深色模式一致：

```css
.docs-surface {
  color: rgb(var(--mdui-color-on-surface));
  background: rgb(var(--mdui-color-surface));
}
```

自定义颜色时，优先覆盖变量或使用 mdui 提供的 token，不建议在每个组件里写死颜色。

## 文档排版 {#typography}

正文区域使用 `mdui-prose` 处理基础排版。你可以继续在全局 CSS 中补充 Markdown 元素样式：

```css
.mdui-prose h2 {
  scroll-margin-top: 96px;
}
```

这能避免点击目录锚点时标题被吸顶 header 遮住。

## 设计建议 {#guidelines}

作为文档系统，界面应优先服务阅读：

- 背景保持统一，不要让内容区碎成太多卡片。
- 导航、目录和正文之间留出稳定间距。
- 按钮和代码块交互要明确，但不要抢正文注意力。
- 移动端优先保证抽屉、目录和正文滚动互不干扰。

