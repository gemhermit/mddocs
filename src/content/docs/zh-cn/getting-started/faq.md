# 常见问题

这里整理使用 MDDocs 时最常见的问题。

## 为什么页面是空的 {#empty-page}

通常是当前语言下缺少对应 Markdown 文件。

例如路由 `getting-started/faq` 会尝试读取：

```text
src/content/docs/zh-cn/getting-started/faq.md
```

英文页面会读取：

```text
src/content/docs/en/getting-started/faq.md
```

请确认两边文件都存在。

## 为什么菜单显示 key {#title-key}

如果侧边栏显示 `docs.somePage` 这样的文本，说明 `src/i18n/index.js` 中没有补充翻译。

在对应语言的 `docs` 字段中添加标题即可。

## 新页面需要手动写路由吗 {#manual-route}

通常不需要。文档路由会根据 `src/data/docs.js` 中的 `docsPages` 自动生成。

你只需要添加 Markdown 文件、侧边栏条目和标题翻译。

## 可以只保留中文吗 {#single-locale}

可以。你可以移除英文入口、语言切换按钮和英文内容目录。

如果未来仍然可能做国际化，建议先保留目录结构，只把英文内容写成占位或简短说明。

## 如何修改站点名称 {#site-name}

站点名称和副标题位于 `src/i18n/index.js` 的 `app` 字段中。浏览器标题后缀在 `src/router/index.js` 中设置。

