# Installation

This page explains how to install and run the MDDocs documentation system locally.

## Requirements {#requirements}

Before you begin, make sure you have:

- Node.js 18 or later.
- pnpm 8 or later.
- Git.

Check your versions with:

```bash
node -v
pnpm -v
git --version
```

## Clone the Project {#clone}

Clone the repository:

```bash
git clone https://github.com/gemhermit/mddocs.git
cd mddocs
```

If you are creating your own documentation site from this project, fork the repository first and clone your fork.

## Install Dependencies {#install-dependencies}

Run this from the project root:

```bash
pnpm install
```

The project uses Vue, Vite, Vue Router, mdui, markdown-it, and highlight.js to render the documentation layout, parse Markdown, and highlight code blocks.

## Start the Dev Server {#dev-server}

Start the local development server:

```bash
pnpm run dev
```

The default URL is:

```text
http://localhost:3000
```

If the port is already in use, Vite will suggest another available port.

## Build for Production {#build}

Create a production build:

```bash
pnpm run build
```

The static output is written to `dist/` and can be deployed to any static hosting service.

## Preview the Production Build {#preview}

After building, run:

```bash
pnpm run preview
```

This serves the `dist/` output locally so you can verify the production build.
