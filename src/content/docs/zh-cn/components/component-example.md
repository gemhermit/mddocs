# 组件示例

这个页面演示如何在 Markdown 文档中说明一个组件。你可以把它复制成自己的组件 API 文档模板。

## 组件说明 {#description}

假设项目提供一个 `DocBadge` 组件，用于在文档中标记状态：

```vue
<DocBadge type="stable">Stable</DocBadge>
```

组件文档应该先说明它解决什么问题，再展示最小可用示例。

## 基础用法 {#basic-usage}

```vue
<template>
  <DocBadge type="beta">Beta</DocBadge>
</template>
```

## 属性 {#props}

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'stable' \| 'beta' \| 'deprecated'` | `'stable'` | 徽标状态 |
| `rounded` | `boolean` | `true` | 是否使用圆角样式 |

## 事件 {#events}

如果组件会触发事件，建议用表格说明：

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `click` | `MouseEvent` | 点击徽标时触发 |

## 编写建议 {#tips}

组件文档最好包含：

- 一段说明用途的简介。
- 最小可运行示例。
- 属性、事件和插槽表格。
- 常见组合和注意事项。

