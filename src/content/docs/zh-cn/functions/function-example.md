# 函数示例

这个页面演示如何为工具函数编写文档。函数文档要比组件文档更重视输入、输出和边界情况。

## 函数签名 {#signature}

假设项目提供一个生成文档链接的函数：

```ts
function createDocLink(locale: 'en' | 'zh-cn', path: string): string
```

## 基础示例 {#basic-example}

```ts
createDocLink('zh-cn', 'getting-started/usage')
// '/zh-cn/docs/getting-started/usage'
```

英文路径没有语言前缀：

```ts
createDocLink('en', 'getting-started/usage')
// '/docs/getting-started/usage'
```

## 参数说明 {#parameters}

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `locale` | `'en' \| 'zh-cn'` | 当前语言 |
| `path` | `string` | 文档相对路径 |

## 返回值 {#returns}

返回可以直接用于链接的站内路径。

## 边界情况 {#edge-cases}

函数文档建议写清楚：

- 空路径如何处理。
- 是否会保留 hash。
- 是否会处理多余的斜杠。
- 输入非法语言时如何降级。

