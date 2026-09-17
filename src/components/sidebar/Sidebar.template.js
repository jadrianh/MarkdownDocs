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
        <!-- Sidebar Header: Título activo (inicia en ANÁLISIS) + Botón minimalista de cambio + Botón ocultar -->
        <div
          class="flex items-center justify-between px-3.5 py-2 border-b border-zinc-200/60 dark:border-zinc-700/50 h-10 shrink-0 bg-white dark:bg-zinc-800 select-none"
        >
          <!-- Sección Activa (Título, Icono y Badge) -->
          <div class="flex items-center gap-2 min-w-0">
            <h2
              class="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase"
            >
              <span
                id="sidebarTitleIcon"
                class="material-symbols-outlined text-primary text-[20px] shrink-0"
                >auto_awesome</span
              >
              <span id="sidebarTitleText">ANÁLISIS</span>
            </h2>
            <span
              id="suggestionsBadge"
              class="hidden px-1.5 py-0.5 text-[10px] font-mono font-bold bg-primary/15 text-primary rounded-full shrink-0"
              >0</span
            >
            <span
              id="outlineBadge"
              class="hidden px-1.5 py-0.5 text-[10px] font-mono font-bold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full shrink-0"
              >0</span
            >
          </div>

          <!-- Acciones de Cabecera -->
          <div class="flex items-center gap-1 shrink-0">
            <button
              id="switchSidebarTabBtn"
              type="button"
              aria-label="Ver estructura"
              title="Ver estructura (Ctrl+Shift+O)"
              class="flex items-center justify-center w-7 h-7 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              <span
                id="switchSidebarTabIcon"
                class="material-symbols-outlined text-[18px]"
                >list_arrow</span
              >
            </button>
            <button
              id="closeSidebarBtn"
              aria-label="Ocultar panel"
              class="flex items-center justify-center w-7 h-7 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              title="Ocultar panel"
            >
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
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
