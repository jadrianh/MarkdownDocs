/**
 * Preview Pane Template
 * Container for rendered HTML markdown preview.
 *
 * @returns {string} HTML markup string
 */
export function renderPreviewPane() {
    return /* html */ `
      <!-- Preview Pane Container -->
      <div
        id="previewPaneContainer"
        class="hidden flex-1 h-full relative flex flex-col min-w-0 bg-white dark:bg-zinc-900 transition-all duration-150 overflow-hidden"
      >
        <!-- Preview Split Header (visible solo en Vista Dividida) -->
        <div
          id="previewSplitHeader"
          class="hidden items-center justify-between px-4 py-1.5 border-b border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/50 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0 select-none"
        >
          <span class="flex items-center gap-1.5 uppercase font-semibold tracking-wider text-[10px] text-zinc-600 dark:text-zinc-400">
            <span class="material-symbols-outlined text-[15px] text-primary">visibility</span>
            Vista previa
          </span>
          <span id="previewLiveBadge" class="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            EN VIVO
          </span>
        </div>

        <!-- Preview Panel -->
        <div
          id="previewPanel"
          class="flex-1 overflow-y-auto p-6 custom-scrollbar prose dark:prose-invert prose-sm max-w-none font-sans leading-relaxed text-zinc-800 dark:text-zinc-200 bg-transparent"
        ></div>
      </div>
    `.trim();
}
