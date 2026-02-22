# Markdown Docs

A smart Markdown editor featuring real-time spelling and grammar correction. This project demonstrates modern web development practices using Vanilla JavaScript and a modular architecture.

**Live Demo:** [Markdown Docs](https://jadrianh.github.io/MarkdownDocs/)

## Key Features

* **Real-Time Grammar Analysis:** Integrates the LanguageTool API to detect and suggest corrections for spelling and grammatical errors.
* **Live Preview:** Renders Markdown into HTML instantly.
* **Modular Architecture:** Uses a custom MVC pattern to separate concerns and maintain clean code.
* **Custom Themes:** Includes dark mode and customizable accent colors.
* **State Management:** Implements a robust history manager for undo and redo operations.

## Tech Stack

* **Core:** Vanilla JavaScript (ES6+), HTML5, CSS3.
* **Tooling:** Vite for fast bundling and local development.
* **Styling:** Tailwind CSS.
* **API:** LanguageTool REST API.

## Architecture Overview

The codebase is organized by feature to ensure high maintainability and scalability. Each module controls its own state, logic, and DOM interactions.

* `core`: Manages the global application state and initialization.
* `editor`: Handles text input, Markdown parsing, and history tracking.
* `grammar`: Manages API communication and renders error correction cards.
* `theme`: Controls UI themes and user preferences.
* `ui`: Provides shared user interface components like toast notifications.

## Local Installation

1.  Clone the repository.
2.  Run `npm install` to install development dependencies.
3.  Run `npm run dev` to start the local Vite server.
4.  Open the provided localhost link in your browser.