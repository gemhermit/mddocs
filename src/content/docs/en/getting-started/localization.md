# Localization

MDDocs ships with English and Simplified Chinese routes. You can keep this structure, remove a locale, or extend it for your own project.

## Route Rules {#routes}

English docs use routes without a locale prefix:

```text
/docs
/docs/getting-started/usage
```

Chinese docs use the `/zh-cn` prefix:

```text
/zh-cn/docs
/zh-cn/docs/getting-started/usage
```

Locale detection lives in `src/utils/site.js`.

## Documentation Content {#content}

Localized Markdown content lives in:

```text
src/content/docs/en/
src/content/docs/zh-cn/
```

Keep matching pages at the same relative path:

```text
en/getting-started/deployment.md
zh-cn/getting-started/deployment.md
```

## UI Labels {#ui-labels}

Menu titles, button labels, and footer text live in `src/i18n/index.js`.

When adding a menu item, add the translated title under `docs`:

```js
docs: {
  deployment: 'Deployment'
}
```

Add the matching Chinese label as well:

```js
docs: {
  deployment: '部署发布'
}
```

## Language Switching {#language-switch}

The language button in the app bar switches between locale-aware routes. Page content is loaded from the Markdown folder that matches the current locale.

If a Markdown file is missing in one locale, that page will render empty. Add both language files when creating new pages.

