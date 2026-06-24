# 本地化

MDDocs 默认提供英文和简体中文两套路径。你可以继续沿用这套结构，也可以按项目需要删减或扩展语言。

## 路径规则 {#routes}

英文文档使用无前缀路径：

```text
/docs
/docs/getting-started/usage
```

中文文档使用 `/zh-cn` 前缀：

```text
/zh-cn/docs
/zh-cn/docs/getting-started/usage
```

语言识别逻辑位于 `src/utils/site.js`。

## 文档内容 {#content}

中英文内容分别放在：

```text
src/content/docs/en/
src/content/docs/zh-cn/
```

建议同一个页面使用相同的相对路径：

```text
en/getting-started/deployment.md
zh-cn/getting-started/deployment.md
```

## 界面文案 {#ui-labels}

菜单标题、按钮文字和页脚文案位于 `src/i18n/index.js`。

新增菜单项时，需要在 `docs` 字段中补充翻译：

```js
docs: {
  deployment: '部署发布'
}
```

英文部分也需要添加对应文案：

```js
docs: {
  deployment: 'Deployment'
}
```

## 切换语言 {#language-switch}

顶部语言按钮会根据当前语言切换到另一套路径。文档内容本身通过当前路径判断语言，并加载对应目录下的 Markdown 文件。

如果某个语言缺少 Markdown 文件，该页面会显示为空。因此添加页面时请同时补齐两种语言。

