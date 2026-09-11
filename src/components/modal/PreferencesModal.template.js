import { PREFERENCES_PAGES } from './pages/registry.js';

/**
 * Preferences Modal Template
 * Modular 2-column layout with left navigation sidebar and isolated, scalable configuration pages.
 *
 * @param {Object} [options={}] - Configurable initial state options
 * @param {string} [options.activeFlavor='gfm'] - Active markdown flavor
 * @param {string} [options.initialPage='appearance'] - Initially selected page ID
 * @returns {string} HTML markup string
 */
export function renderPreferencesModal(options = {}) {
    const { activeFlavor = 'gfm', initialPage = 'appearance' } = options;

    const initialPageLabel = PREFERENCES_PAGES.find(p => p.id === initialPage)?.label || 'Apariencia';

    return /* html */ `
    <div
      id="themeModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="themeModalTitle"
      class="fixed inset-0 z-50 hidden flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm bg-black/40"
    >
      <div
        id="themeModalBackdrop"
        class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity opacity-0"
      ></div>

      <div
        id="themeModalContent"
        class="relative z-10 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl w-full max-w-3xl shadow-2xl flex flex-col h-[580px] max-h-[90vh] overflow-hidden transform scale-95 opacity-0 transition-all duration-200"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-200/70 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900 select-none z-10"
        >
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <div class="flex items-center gap-2">
              <h2
                id="themeModalTitle"
                class="font-sans text-zinc-900 dark:text-zinc-100 text-sm sm:text-base font-semibold tracking-tight"
              >
                Preferencias
              </h2>
              <span class="text-zinc-300 dark:text-zinc-700 text-xs">/</span>
              <span
                id="preferencesCurrentPageLabel"
                class="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider"
              >
                ${initialPageLabel}
              </span>
            </div>
          </div>

          <button
            id="closeThemeModal"
            aria-label="Cerrar ventana de preferencias"
            class="flex items-center justify-center w-7 h-7 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- Modal Body: Two-Column Responsive Layout -->
        <div class="flex flex-1 min-h-0 flex-col sm:flex-row overflow-hidden">
          <!-- Left Navigation Sidebar -->
          <nav
            id="preferencesSidebar"
            role="tablist"
            aria-label="Páginas de preferencias"
            class="w-full sm:w-52 md:w-56 shrink-0 bg-zinc-50/75 dark:bg-zinc-900/50 border-b sm:border-b-0 sm:border-r border-zinc-200/70 dark:border-zinc-800 p-2 sm:p-2.5 flex flex-row sm:flex-col gap-1 overflow-x-auto sm:overflow-y-auto"
            data-purpose="pref-sidebar"
          >
            ${PREFERENCES_PAGES.map((page) => {
                const isActive = page.id === initialPage;
                return /* html */ `
                  <button
                    type="button"
                    id="pref-tab-${page.id}"
                    role="tab"
                    aria-selected="${isActive ? 'true' : 'false'}"
                    aria-controls="pref-page-${page.id}"
                    data-page-id="${page.id}"
                    class="pref-nav-btn flex items-center gap-2.5 px-3 py-2 rounded-md text-xs sm:text-[13px] font-sans font-medium transition-all text-left w-full cursor-pointer select-none shrink-0 sm:shrink ${isActive ? 'active' : ''}"
                  >
                    <span
                      class="material-symbols-outlined text-[19px] shrink-0 ${isActive ? 'text-primary' : 'text-zinc-400'} transition-colors"
                    >${page.icon}</span>
                    <span class="truncate transition-colors">${page.label}</span>
                  </button>
                `;
            }).join('')}
          </nav>

          <!-- Right Content Container: Tab Panels -->
          <div class="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 overflow-hidden relative">
            ${PREFERENCES_PAGES.map((page) => {
                const isActive = page.id === initialPage;
                return /* html */ `
                  <div
                    id="pref-page-${page.id}"
                    role="tabpanel"
                    aria-labelledby="pref-tab-${page.id}"
                    class="pref-page-panel flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar ${isActive ? '' : 'hidden'}"
                    tabindex="0"
                  >
                    <!-- Page Header -->
                    <div class="border-b border-zinc-200/60 dark:border-zinc-800 pb-3">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-[20px]">${page.icon}</span>
                        <h3 class="font-sans font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 leading-tight">
                          ${page.label}
                        </h3>
                      </div>
                      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        ${page.description}
                      </p>
                    </div>

                    <!-- Page Body Content -->
                    ${page.render({ activeFlavor })}
                  </div>
                `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
    `.trim();
}
