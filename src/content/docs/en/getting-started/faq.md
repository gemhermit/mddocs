# Frequently Asked Questions

This page collects common questions when working with MDDocs.

## Why Is a Page Empty? {#empty-page}

The most common reason is a missing Markdown file for the current locale.

For example, the route `getting-started/faq` loads:

```text
src/content/docs/en/getting-started/faq.md
```

The Chinese page loads:

```text
src/content/docs/zh-cn/getting-started/faq.md
```

Make sure both files exist when you support both languages.

## Why Does the Sidebar Show a Key? {#title-key}

If the sidebar displays text like `docs.somePage`, the title is missing from `src/i18n/index.js`.

Add the label under the `docs` field for each locale.

## Do New Pages Need Manual Routes? {#manual-route}

Usually no. Docs routes are generated from `docsPages` in `src/data/docs.js`.

Add the Markdown file, sidebar entry, and translated title.

## Can I Keep Only One Locale? {#single-locale}

Yes. You can remove the extra locale route, language switcher, and unused content folder.

If you may add localization later, keep the folder structure and use short placeholder docs.

## How Do I Change the Site Name? {#site-name}

The site name and tagline live under the `app` field in `src/i18n/index.js`. The browser title suffix is set in `src/router/index.js`.

