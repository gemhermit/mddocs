# 独立包示例

如果你的项目包含多个包，可以用独立包文档说明每个包的安装方式、入口、体积和适用场景。

## 包定位 {#positioning}

假设项目提供一个独立的 Markdown 工具包：

```text
@mddocs/markdown
```

它负责解析标题锚点、包装代码块，并输出适合文档站使用的 HTML。

## 安装 {#installation}

```bash
npm install @mddocs/markdown
```

## 使用 {#usage}

```ts
import { renderMarkdown } from '@mddocs/markdown'

const html = renderMarkdown('# Hello')
```

## API {#api}

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `renderMarkdown` | `(source: string) => string` | 将 Markdown 渲染为 HTML |
| `extractHeadings` | `(html: string) => Heading[]` | 提取页面目录 |

## 版本策略 {#versioning}

独立包文档建议说明：

- 支持的 Node.js 版本。
- 是否支持 ESM 和 CommonJS。
- 与主项目版本是否同步。
- 破坏性变更如何记录。

