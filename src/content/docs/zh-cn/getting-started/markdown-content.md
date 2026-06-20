# Markdown 内容

MDDocs 使用 Markdown 作为文档的主要内容格式。这样文档可以像源码一样被审查、搜索、版本管理和开源协作。

## 页面标题 {#page-title}

每个页面建议只保留一个一级标题：

```md
# 页面标题
```

一级标题用于正文开头。右侧目录会从二级标题和三级标题生成。

## 标题锚点 {#heading-anchors}

你可以为标题指定稳定锚点：

```md
## 安装依赖 {#install-dependencies}
```

如果没有写 `{#id}`，系统会根据标题文本自动生成锚点。需要被外部链接引用的标题，建议手动指定。

## 链接写法 {#links}

站内链接可以直接使用绝对路径：

```md
[安装](/zh-cn/docs/2/getting-started/installation)
```

英文页面对应路径为：

```md
[Installation](/docs/2/getting-started/installation)
```

## 代码块 {#code-blocks}

代码块会自动高亮，并在 hover 时展示复制按钮：

```bash
pnpm run build
```

建议始终标注语言：

~~~md
```js
export const siteName = 'MDDocs'
```
~~~

## 内容风格 {#writing-style}

写文档时建议：

- 每个页面围绕一个明确主题。
- 用短段落解释背景，用代码块展示操作。
- 优先写真实路径、真实命令和可运行示例。
- 页面底部自然接到下一章，不需要重复写导航。
