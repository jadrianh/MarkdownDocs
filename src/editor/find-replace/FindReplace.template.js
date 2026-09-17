/**
 * Find & Replace Widget Template
 * Barra flotante y compacta tipo editor moderno (VS Code / Obsidian)
 * para búsqueda interactiva, resaltado y reemplazo en el editor.
 *
 * @returns {string} HTML markup
 */
export function renderFindReplaceWidget() {
    return /* html */ `
      <div
        id="findReplaceWidget"
        role="region"
        aria-label="Buscar y reemplazar"
        class="hidden absolute top-2 right-4 z-30 w-80 max-w-[calc(100%-2rem)] bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md shadow-xl border border-zinc-200/80 dark:border-zinc-700/80 rounded-lg p-1.5 flex flex-col gap-1.5 text-xs font-mono select-none animate-fade-in"
      >
        <!-- Fila 1: Búsqueda -->
        <div class="flex items-center gap-1">
          <!-- Botón Desplegar / Colapsar Reemplazo -->
          <button
            id="findToggleReplaceBtn"
            type="button"
            aria-label="Alternar campo de reemplazo"
            aria-expanded="false"
            class="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded transition-colors"
            title="Alternar reemplazo (Ctrl+H)"
          >
            <span id="findToggleReplaceIcon" class="material-symbols-outlined text-[18px] transition-transform">chevron_right</span>
          </button>

          <!-- Input de Búsqueda y Contador -->
          <div class="relative flex-1 flex items-center min-w-0">
            <input
              id="findInput"
              type="text"
              placeholder="Buscar..."
              aria-label="Buscar texto"
              autocomplete="off"
              spellcheck="false"
              class="w-full h-7 pl-2 pr-14 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono"
            />
            <span
              id="findCountBadge"
              class="absolute right-1.5 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono pointer-events-none"
            >0 / 0</span>
          </div>

          <!-- Coincidir Mayúsculas/Minúsculas -->
          <button
            id="findMatchCaseBtn"
            type="button"
            aria-label="Coincidir mayúsculas y minúsculas"
            aria-pressed="false"
            class="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded font-sans font-bold text-[11px] transition-colors"
            title="Coincidir mayúsculas y minúsculas"
          >
            Aa
          </button>

          <!-- Coincidencia Anterior -->
          <button
            id="findPrevBtn"
            type="button"
            aria-label="Coincidencia anterior"
            class="flex items-center justify-center w-6 h-6 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Anterior (Shift+Enter)"
          >
            <span class="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
          </button>

          <!-- Siguiente Coincidencia -->
          <button
            id="findNextBtn"
            type="button"
            aria-label="Siguiente coincidencia"
            class="flex items-center justify-center w-6 h-6 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded transition-colors disabled:opacity-30 disabled:pointer-events-none"
            title="Siguiente (Enter)"
          >
            <span class="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
          </button>

          <!-- Cerrar Widget -->
          <button
            id="findCloseBtn"
            type="button"
            aria-label="Cerrar búsqueda"
            class="flex items-center justify-center w-6 h-6 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded transition-colors"
            title="Cerrar (Esc)"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Fila 2: Reemplazo (Colapsable) -->
        <div id="replaceRow" class="hidden items-center gap-1 pl-7">
          <input
            id="replaceInput"
            type="text"
            placeholder="Reemplazar con..."
            aria-label="Reemplazar con"
            autocomplete="off"
            spellcheck="false"
            class="flex-1 h-7 px-2 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700 rounded text-xs text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono min-w-0"
          />
          <button
            id="replaceBtn"
            type="button"
            aria-label="Reemplazar coincidencia actual"
            class="px-2 h-7 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-[11px] font-medium text-zinc-700 dark:text-zinc-200 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
            title="Reemplazar"
          >
            Reemplazar
          </button>
          <button
            id="replaceAllBtn"
            type="button"
            aria-label="Reemplazar todas las coincidencias"
            class="px-2 h-7 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded text-[11px] font-medium text-zinc-700 dark:text-zinc-200 transition-colors disabled:opacity-30 disabled:pointer-events-none shrink-0"
            title="Reemplazar todo"
          >
            Todo
          </button>
        </div>
      </div>
    `.trim();
}
