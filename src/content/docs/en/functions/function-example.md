# Function Example

This page shows how to document a utility function. Function docs should focus on inputs, outputs, and edge cases.

## Signature {#signature}

Assume the project provides a function for generating docs links:

```ts
function createDocLink(locale: 'en' | 'zh-cn', path: string): string
```

## Basic Example {#basic-example}

```ts
createDocLink('zh-cn', 'getting-started/usage')
// '/zh-cn/docs/getting-started/usage'
```

English routes have no locale prefix:

```ts
createDocLink('en', 'getting-started/usage')
// '/docs/getting-started/usage'
```

## Parameters {#parameters}

| Parameter | Type | Description |
| --- | --- | --- |
| `locale` | `'en' \| 'zh-cn'` | Current locale |
| `path` | `string` | Relative docs path |

## Return Value {#returns}

Returns an internal path that can be used directly in links.

## Edge Cases {#edge-cases}

Function docs should explain:

- How empty paths are handled.
- Whether hash fragments are preserved.
- Whether duplicate slashes are normalized.
- How unsupported locales fall back.

