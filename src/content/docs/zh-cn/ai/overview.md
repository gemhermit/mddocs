# AI 概览

MDDocs 可以把文档内容组织成适合 AI 阅读的结构：页面路径稳定、Markdown 源文件清晰、标题锚点明确、代码块可复制。

## 适合 AI 的文档结构 {#ai-friendly-structure}

AI 更容易处理结构稳定的文档。建议保持：

- 每页一个明确主题。
- 标题层级不跳跃。
- 操作步骤使用有序列表。
- 配置、路径、命令使用代码块。
- 长页面拆分成多个独立页面。

## 顶部 AI 菜单 {#ai-menu}

顶部的 AI 入口可以提供几类能力：

- 复制 `llms.txt` 或完整文档索引链接。
- 打开当前页面的 Markdown 源文件。
- 将当前页面或整站文档交给 AI 进行讨论。

如果你要发布自己的项目，建议把这些链接改成自己的仓库、站点域名或公开文档索引。

## 推荐的 llms.txt 内容 {#llms-txt}

可以在公开站点根目录放置 `llms.txt`，列出 AI 应优先阅读的文档：

```text
# MDDocs

MDDocs is an open-source documentation system built on mdui 2.

- Overview: /docs/2/
- Installation: /docs/2/getting-started/installation
- Usage: /docs/2/getting-started/usage
```

完整版本可以放到 `llms-full.txt`，包含更多页面链接和说明。

## 使用建议 {#tips}

编写面向 AI 的文档时，优先提供真实上下文，不要只写营销式描述。路径、命令、配置字段和失败排查步骤越明确，AI 越容易给出可用回答。

