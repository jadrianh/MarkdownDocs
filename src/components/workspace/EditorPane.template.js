import { renderFindReplaceWidget } from '../../editor/find-replace/FindReplace.template.js';

/**
 * Editor Pane Template
 * Textarea for markdown source input with integrated floating find & replace widget.
 *
 * @returns {string} HTML markup string
 */
export function renderEditorPane() {
    return /* html */ `
      <!-- Editor Pane Container -->
      <div
        id="editorPaneContainer"
        class="flex-1 w-full h-full relative flex flex-col min-w-0 transition-all duration-150 overflow-hidden"
      >
        ${renderFindReplaceWidget()}
        <textarea
          id="editor"
          aria-label="Contenido Markdown del editor"
          class="w-full h-full p-6 resize-none outline-none border-none focus:ring-0 text-base font-mono leading-relaxed text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 bg-transparent custom-scrollbar"
          placeholder="Comienza a escribir..."
          spellcheck="false"
        ></textarea>
      </div>
    `.trim();
}
