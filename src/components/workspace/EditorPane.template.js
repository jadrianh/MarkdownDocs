/**
 * Editor Pane Template
 * Textarea for markdown source input.
 *
 * @returns {string} HTML markup string
 */
export function renderEditorPane() {
    return /* html */ `
      <!-- Editor Textarea -->
      <textarea
        id="editor"
        aria-label="Contenido Markdown del editor"
        class="absolute inset-0 w-full h-full p-6 resize-none outline-none border-none focus:ring-0 text-base font-mono leading-relaxed text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 bg-transparent custom-scrollbar"
        placeholder="Comienza a escribir..."
        spellcheck="false"
      ></textarea>
    `.trim();
}
