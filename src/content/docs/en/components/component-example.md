# Component Example

This page shows how to document a component in Markdown. You can copy it as a template for your own component API docs.

## Description {#description}

Assume your project provides a `DocBadge` component for showing status labels in documentation:

```vue
<DocBadge type="stable">Stable</DocBadge>
```

Start component docs by explaining what problem the component solves, then show the smallest useful example.

## Basic Usage {#basic-usage}

```vue
<template>
  <DocBadge type="beta">Beta</DocBadge>
</template>
```

## Props {#props}

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'stable' \| 'beta' \| 'deprecated'` | `'stable'` | Badge status |
| `rounded` | `boolean` | `true` | Whether rounded styling is used |

## Events {#events}

If the component emits events, document them in a table:

| Event | Payload | Description |
| --- | --- | --- |
| `click` | `MouseEvent` | Emitted when the badge is clicked |

## Tips {#tips}

Good component docs usually include:

- A short explanation of purpose.
- A minimal runnable example.
- Props, events, and slots tables.
- Common combinations and notes.

