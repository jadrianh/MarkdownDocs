import { renderEmptyState } from './SuggestionStates.js';

/**
 * Suggestions Sidebar Template
 * Includes mobile backdrop and side panel with header, badge, and results container.
 *
 * @returns {string} HTML markup string
 */
export function renderSidebar() {
    return /* html */ `
      <!-- Mobile Backdrop for Sidebar -->
      <div
        id="sidebarBackdrop"
        class="fixed inset-0 bg-black/40 z-30 hidden transition-opacity"
      ></div>

      <!-- BEGIN: Suggestions Sidebar -->
      <aside
        id="suggestionsSidebar"
        aria-label="Panel lateral de sugerencias"
        class="w-80 flex flex-col bg-zinc-50 dark:bg-zinc-800 shrink-0 border-l border-zinc-200/60 dark:border-zinc-700/50"
        data-purpose="suggestions-sidebar"
      >
        <!-- Sidebar Header with Switch: Sugerencias / Estructura + Botón Ocultar Panel -->
        <div
          class="flex items-center justify-between px-2.5 py-1.5 border-b border-zinc-200/60 dark:border-zinc-700/50 h-10 shrink-0 bg-white dark:bg-zinc-800 gap-2"
        >
          <!-- Switch de 2 posiciones: Sugerencias / Estructura -->
          <div
            id="sidebarSwitch"
            role="tablist"
            aria-label="Cambiar entre sugerencias y estructura"
            class="flex-1 flex items-center bg-zinc-100 dark:bg-zinc-900/70 p-0.5 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-mono select-none"
          >
            <!-- Opción 1: Sugerencias -->
            <button
              id="tabSuggestionsBtn"
              type="button"
              role="tab"
              aria-selected="true"
              aria-controls="resultsPanel"
              class="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-semibold tracking-wide transition-all shadow-xs bg-white dark:bg-zinc-800 text-primary"
              title="Ver sugerencias ortográficas y gramaticales"
            >
              <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Sugerencias</span>
              <span
                id="suggestionsBadge"
                class="hidden px-1.5 py-0.2 text-[10px] font-mono font-bold bg-primary text-white rounded-full ml-0.5"
                >0</span
              >
            </button>

            <!-- Opción 2: Estructura -->
            <button
              id="tabOutlineBtn"
              type="button"
              role="tab"
              aria-selected="false"
              aria-controls="outlinePanel"
              class="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-medium tracking-wide transition-all text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              title="Ver estructura y esquema de encabezados"
            >
              <span class="material-symbols-outlined text-[16px]">toc</span>
              <span>Estructura</span>
              <span
                id="outlineBadge"
                class="hidden px-1.5 py-0.2 text-[10px] font-mono font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full ml-0.5"
                >0</span
              >
            </button>
          </div>

          <!-- Botón Ocultar Panel -->
          <button
            id="closeSidebarBtn"
            aria-label="Ocultar panel"
            class="flex items-center justify-center w-7 h-7 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors shrink-0"
            title="Ocultar panel"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <!-- Sidebar Content Panels -->
        <div class="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <!-- Panel de Sugerencias -->
          <div
            id="resultsPanel"
            role="tabpanel"
            aria-labelledby="tabSuggestionsBtn"
            aria-live="polite"
            aria-atomic="false"
            class="flex-1 overflow-y-auto p-4 custom-scrollbar"
          >
            ${renderEmptyState()}
          </div>

          <!-- Panel de Estructura / Índice de Encabezados -->
          <div
            id="outlinePanel"
            role="tabpanel"
            aria-labelledby="tabOutlineBtn"
            class="hidden flex-1 overflow-y-auto p-3 custom-scrollbar"
          >
            <!-- Renderizado dinámicamente por OutlineView -->
          </div>
        </div>
      </aside>
    `.trim();
}
