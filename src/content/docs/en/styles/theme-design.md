# Theme Design

MDDocs uses mdui 2 and Material Design 3 as its visual foundation. You can keep the default style or gradually adapt it to your project's brand.

## Style Entry {#style-entry}

Global styles live in:

```text
src/styles/main.css
```

Common changes include:

- Page background.
- Maximum width for docs content.
- Code block styling.
- Sidebar, table of contents, and bottom navigation spacing.
- Responsive breakpoints.

## Color Strategy {#colors}

The project uses mdui CSS variables so light and dark modes stay consistent:

```css
.docs-surface {
  color: rgb(var(--mdui-color-on-surface));
  background: rgb(var(--mdui-color-surface));
}
```

When customizing colors, prefer variables or mdui tokens instead of hard-coded colors in each component.

## Docs Typography {#typography}

The content area uses `mdui-prose` for baseline typography. You can add Markdown element styles in the global CSS:

```css
.mdui-prose h2 {
  scroll-margin-top: 96px;
}
```

This prevents sticky headers from covering headings after anchor navigation.

## Design Guidelines {#guidelines}

For a documentation system, the interface should prioritize reading:

- Keep the background unified instead of splitting the page into too many cards.
- Preserve stable spacing between navigation, table of contents, and content.
- Make buttons and code interactions clear without distracting from the text.
- On mobile, ensure drawer scrolling and page scrolling remain independent.

