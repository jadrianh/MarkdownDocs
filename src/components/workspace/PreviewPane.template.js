/**
 * Preview Pane Template
 * Container for rendered HTML markdown preview.
 *
 * @returns {string} HTML markup string
 */
export function renderPreviewPane() {
    return /* html */ `
      <!-- Preview Panel (comparte espacio con el editor) -->
      <div
        id="previewPanel"
        class="hidden absolute inset-0 overflow-y-auto p-6 custom-scrollbar prose dark:prose-invert prose-sm max-w-none font-sans leading-relaxed text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900"
      ></div>
    `.trim();
}
