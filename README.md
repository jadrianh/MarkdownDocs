# Markdown Docs

<div align="center">

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-2ea44f?style=for-the-badge&logo=github)](https://jadrianh.github.io/MarkdownDocs/)
[![Build & Test](https://img.shields.io/badge/Tests-73%20passed-brightgreen?style=for-the-badge&logo=vitest)](https://github.com/jadrianh/MarkdownDocs/actions)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<p align="center">
  <strong>A high-precision, distraction-free technical writing environment with real-time linguistic intelligence and math typesetting.</strong>
</p>

[**Explore Live Demo**](https://jadrianh.github.io/MarkdownDocs/) • [**Report Bug**](https://github.com/jadrianh/MarkdownDocs/issues) • [**Request Feature**](https://github.com/jadrianh/MarkdownDocs/issues)

</div>

---

## Overview

**Markdown Docs** is a modern, modular Markdown editor engineered with pure **Vanilla JavaScript (ES6+)** and designed around a clean Model-View-Controller (MVC) architecture. It bridges technical writing with linguistic accuracy by offering real-time spelling and grammar analysis, live split-pane rendering, mathematical typesetting via KaTeX, code syntax highlighting, automated document outlining, and robust local persistence.

---

## Key Features

### Real-Time Grammar & Spell Checking
- **LanguageTool API Integration:** Detects grammatical nuances, typos, spelling errors, and style suggestions as you write.
- **Interactive Suggestions Sidebar:** Dedicated inspection card for each detected issue with explanations, suggested replacements, and one-click correction or dismissal.

### Live Preview & Split-View
- **Instant HTML Rendering:** Fast preview powered by Marked with DOMPurify sanitization.
- **Dual-Pane Split View:** Side-by-side editing and previewing with an interactive resizable divider.
- **Synchronized Scrolling:** Proportional scroll lock between the source editor and preview pane.

### Math Typesetting & Code Highlighting
- **KaTeX Equations:** Inline (`$...$`) and display block (`$$...$$`) LaTeX mathematical expressions with full webfont rendering.
- **PrismJS Highlighting:** Multi-language syntax highlighting for code fences with copy-to-clipboard functionality.

### Document Structure & Outline Navigation
- **Hierarchical Headings Tree:** Automatically parses and renders a live `H1`–`H6` document map.
- **Smooth Navigation:** Click any outline node to immediately scroll and place the cursor directly at that section.
- **Sidebar Tab Switcher:** Effortlessly switch between Linguistic Suggestions and Document Outline in the collapsible sidebar.

### Intelligent Auto-Formatter & Formatting Tools
- **Auto-Formatting Engine:** Automatically cleans excessive whitespace, formats Markdown tables, standardizes list indentation, and normalizes blockquotes.
- **Rich Utility Toolbar:** Quick actions for bold, italic, headings, blockquotes, lists, inline code, links, tables, and math equations.

### Find & Replace
- **Advanced Search Console:** In-editor find and replace with regular expressions (RegEx), case sensitivity, and whole-word matching.

### Deep Personalization & Theming
- **Three Display Modes:** Light Mode, Dark Mode, and an OLED-friendly **Pure Black** theme.
- **Dynamic Accent Colors:** Real-time color picker and curated palette that dynamically updates CSS design tokens.
- **Custom Typography:** Configurable font sizes, line heights, and font families for both the editor and preview areas.

### Resilient Storage & Multi-Format Export
- **Crash-Resilient Auto-Save:** Automatically persists edits to `localStorage` with corrupted-state recovery.
- **Export Formats:**
  - **Markdown (`.md`)**: Download raw source files.
  - **HTML (`.html`)**: Clean, standalone rendered documents.
  - **PDF (`.pdf`)**: Optimized, clean print layout featuring right-aligned bottom pagination without browser header/URL clutter.

---

## Tech Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Core Architecture** | **Vanilla JavaScript (ES6+)** | Zero-framework reactive state, custom MVC, EventBus |
| **Build & Tooling** | **Vite 8** + **pnpm** | Instant HMR, lightning-fast bundling, Rollup chunk splitting |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS, container queries, typography plugin |
| **Markdown Engine** | **Marked v18** | High-performance Markdown parser |
| **Math Typesetting** | **KaTeX** + **marked-katex-extension** | Fast LaTeX formula rendering |
| **Syntax Highlighting**| **PrismJS** | Code fence highlighting |
| **Sanitization** | **DOMPurify** | XSS protection for rendered HTML |
| **Linguistic API** | **LanguageTool REST API** | Multi-language spelling and grammar analysis |
| **Testing** | **Vitest** & **Playwright** | 73 unit/service tests + End-to-end browser automation |

---

## Architecture Overview

The codebase is organized by distinct domains to ensure high maintainability, strict separation of concerns, and clean scalability:

```
MarkdownDocs/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated CI/CD pipeline for GitHub Pages
├── public/
│   ├── favicon.svg             # Application favicon
│   └── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── src/
│   ├── api/                    # Linguistic API clients (LanguageTool REST integration)
│   ├── components/             # Reusable UI component modules
│   │   ├── modal/              # Settings, typography, and keyboard shortcut modals
│   │   ├── sidebar/            # Linguistic suggestions & document outline sidebar
│   │   ├── toolbar/            # Editor action buttons and markdown format tools
│   │   └── workspace/          # Dual panes (EditorPane, PreviewPane, SplitDivider)
│   ├── core/                   # Application kernel
│   │   ├── app.js              # Application lifecycle coordinator
│   │   ├── eventBus.js         # Decoupled publish-subscribe communication
│   │   ├── state.js            # Global reactive application state
│   │   └── storage.service.js  # LocalStorage resilience, auto-save & export routines
│   ├── editor/                 # Markdown editor domain
│   │   ├── editor.controller.js# Editor orchestration & DOM interactions
│   │   ├── editor.model.js     # Text buffer, selection handling, undo/redo stacks
│   │   ├── editor.view.js      # Layout toggling (Editor, Preview, Split view)
│   │   ├── find-replace/       # In-buffer search and replace service
│   │   ├── outline/            # Real-time heading tree extraction & navigation
│   │   ├── parsers/            # Marked + KaTeX + PrismJS pipeline
│   │   └── markdown.formatter.js # Auto-formatter (whitespace, tables, lists)
│   ├── theme/                  # Theme switcher (Light, Dark, OLED Black & accent colors)
│   ├── ui/                     # UI components, status bar metrics & toast notifications
│   └── style.css               # Design tokens, custom scrollbars, and print stylesheets
└── vite.config.ts              # Vite bundling, base path resolver & chunk strategy
```

---

## Essential Keyboard Shortcuts

| Action | Windows / Linux | macOS |
| :--- | :--- | :--- |
| **Bold** | <kbd>Ctrl</kbd> + <kbd>B</kbd> | <kbd>⌘</kbd> + <kbd>B</kbd> |
| **Italic** | <kbd>Ctrl</kbd> + <kbd>I</kbd> | <kbd>⌘</kbd> + <kbd>I</kbd> |
| **Insert Link** | <kbd>Ctrl</kbd> + <kbd>K</kbd> | <kbd>⌘</kbd> + <kbd>K</kbd> |
| **Inline Code** | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> | <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd> |
| **Auto-Format Document** | <kbd>Tab</kbd> *(or via Format button)* | <kbd>Tab</kbd> |
| **Toggle Split View** | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> | <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>S</kbd> |
| **Solo Editor / Preview**| <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>E</kbd> / <kbd>P</kbd> | <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>E</kbd> / <kbd>P</kbd> |
| **Close Open Modal** | <kbd>Esc</kbd> | <kbd>Esc</kbd> |

---

## Local Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (recommended) or `npm`

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/jadrianh/MarkdownDocs.git
   cd MarkdownDocs
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or: npm install
   ```

3. **Start local development server:**
   ```bash
   pnpm dev
   # or: npm run dev
   ```
   Open your browser and navigate to the displayed local address (typically `http://localhost:5173`).

---

## 🧪 Testing & Quality Assurance

The project enforces high code quality through continuous testing and strict linting:

```bash
# Run unit & service test suite with Vitest
pnpm test run

# Run tests in interactive watch mode
pnpm test

# Generate code coverage report
pnpm coverage

# Run static linting with ESLint
pnpm lint

# Execute End-to-End browser tests with Playwright
pnpm test:e2e
```

---

## Continuous Deployment (GitHub Pages)

Deployment is fully automated through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

- On push to `main` or `dev-v3`, the workflow:
  1. Installs dependencies cleanly with `pnpm install --frozen-lockfile`.
  2. Runs static code analysis (`pnpm lint`).
  3. Executes the full test suite (`pnpm test run`).
  4. Resolves the GitHub Pages subpath dynamically via `actions/configure-pages`.
  5. Compiles the production bundle with optimized vendor chunking (`pnpm build`).
  6. Deploys directly to **GitHub Pages**.

---

## License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute it for personal and commercial projects.
