# AI Overview

MDDocs organizes documentation in a way that is easy for AI tools to read: stable page paths, clear Markdown source files, explicit heading anchors, and copyable code blocks.

## AI-Friendly Structure {#ai-friendly-structure}

AI tools work better with predictable structure. Keep docs organized with:

- One clear topic per page.
- Consistent heading levels.
- Ordered lists for procedures.
- Code blocks for commands, paths, and configuration.
- Separate pages instead of very long mixed-topic documents.

## App Bar AI Menu {#ai-menu}

The AI entry in the app bar can expose useful actions:

- Copy `llms.txt` or full documentation index links.
- Open the Markdown source for the current page.
- Discuss the current page or full docs with an AI assistant.

When publishing your own project, update these links to point to your repository, site domain, or public documentation index.

## Suggested llms.txt {#llms-txt}

You can publish `llms.txt` at the site root to list the pages AI tools should read first:

```text
# MDDocs

MDDocs is an open-source documentation system built on mdui 2.

- Overview: /docs/2/
- Installation: /docs/2/getting-started/installation
- Usage: /docs/2/getting-started/usage
```

Use `llms-full.txt` for a more complete list of pages and notes.

## Tips {#tips}

When writing for AI-assisted reading, prefer concrete context over marketing language. Real paths, commands, configuration fields, and troubleshooting notes make answers more useful.

