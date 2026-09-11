/**
 * Workspace Footer Template
 * Example text button and live word/character counters.
 *
 * @returns {string} HTML markup string
 */
export function renderWorkspaceFooter() {
    return /* html */ `
        <!-- Footer Bar -->
        <div
          class="flex w-full items-center justify-end gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2 border-t border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0 text-xs font-mono text-zinc-500 dark:text-zinc-400"
        >
          <!-- Auto-Save Status Indicator (Únicamente icono minimalista) -->
          <div
            id="saveStatusContainer"
            class="flex items-center justify-center select-none transition-all duration-150"
            title="Borrador guardado localmente"
          >
            <span id="saveStatusIcon" class="material-symbols-outlined text-[17px] text-zinc-400 dark:text-zinc-500 transition-colors duration-200">cloud</span>
          </div>

          <div class="w-px h-3.5 bg-zinc-200 dark:bg-zinc-700"></div>

          <!-- Contadores de palabras y caracteres -->
          <div class="flex items-center gap-2 sm:gap-4 shrink-0 text-[11px] sm:text-xs">
            <span id="wordCount" class="tabular-nums font-mono">0 PALABRAS</span>
            <span id="charCount" class="tabular-nums font-mono">0 CARACTERES</span>
          </div>
        </div>
    `.trim();
}
