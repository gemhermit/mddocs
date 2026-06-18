# Writing Docs with AI

AI can help draft pages, fill examples, generate bilingual versions, and review structure, but maintainers should still review the final content.

## Recommended Workflow {#workflow}

A practical workflow is:

1. Define the page goal and target reader.
2. Ask AI to generate an outline and first draft.
3. Add real commands, paths, and project-specific constraints.
4. Ask AI to check for missing prerequisites, failure cases, and next steps.
5. Run the site locally and review the reading experience manually.

## Example Prompt {#prompt}

Here is a prompt for drafting a page:

```text
You are writing documentation for an open-source docs system built with Vue, Vite, mdui 2, and Markdown.
Draft an English page about deployment.
Include the build command, local preview, a GitHub Pages example, and a release checklist.
Use a clear engineering style, not marketing copy.
```

## Translating Pages {#translation}

You can ask AI to create a matching localized page:

```text
Translate the following Markdown document into Simplified Chinese.
Preserve heading anchors, code blocks, link paths, and list structure.
Do not change file paths or commands.
```

After translating, review terminology, link paths, and tone.

## Review Checklist {#review-checklist}

After AI generates content, check that:

- Commands are real and runnable.
- File paths exist.
- Links point to the current project.
- Heading anchors match between localized pages where needed.
- No unrelated third-party APIs or nonexistent configuration options were introduced.

