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
        <!-- Sidebar Header -->
        <div
          class="flex items-center justify-between px-4 py-2 border-b border-zinc-200/60 dark:border-zinc-700/50 h-10 shrink-0 bg-white dark:bg-zinc-800"
        >
          <div class="flex items-center gap-2">
            <h2
              class="text-xs font-bold tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 uppercase"
            >
              <span class="material-symbols-outlined text-primary text-[20px]"
                >auto_awesome</span
              >
              <span>SUGERENCIAS</span>
            </h2>
            <span
              id="suggestionsBadge"
              class="hidden px-1.5 py-0.5 text-[10px] font-mono font-bold bg-primary/15 text-primary rounded-full"
              >0</span
            >
          </div>
          <button
            id="closeSidebarBtn"
            aria-label="Cerrar panel de sugerencias"
            class="flex items-center justify-center w-7 h-7 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
            title="Ocultar panel"
          >
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        <!-- Sidebar Content -->
        <div
          id="resultsPanel"
          aria-live="polite"
          aria-atomic="false"
          class="flex-1 overflow-y-auto p-4 custom-scrollbar"
        >
          ${renderEmptyState()}
        </div>
      </aside>
    `.trim();
}
