/**
 * Utility Tools Template
 * Flavor dropdown, language dropdown, view toggle, sidebar toggle, history/clipboard and mobile more-actions.
 *
 * @returns {string} HTML markup string
 */
export function renderUtilityTools() {
    return /* html */ `
      <div class="flex items-center gap-0.5 @[600px]:gap-1 text-xs font-mono shrink-0">
        <!-- Language Selector Dropdown -->
        <div class="relative dropdown-container flex items-center">
          <button
            id="btnLanguage"
            aria-label="Seleccionar idioma de corrección"
            aria-haspopup="listbox"
            aria-expanded="false"
            class="dropdown-trigger flex items-center justify-center gap-1 px-1.5 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300 font-mono text-xs"
            title="Idioma de corrección: Español"
          >
            <span class="material-symbols-outlined text-[20px]">translate</span>
            <span
              id="currentLangText"
              class="hidden @[640px]:inline font-semibold text-xs tracking-wide uppercase"
              >ES</span
            >
            <span
              class="material-symbols-outlined text-[18px] text-zinc-400 -ml-0.5"
              >arrow_drop_down</span
            >
          </button>
          <div
            id="menuLanguage"
            role="listbox"
            aria-label="Idioma de corrección"
            class="dropdown-menu hidden absolute top-full right-0 mt-1 z-50 w-56 max-h-64 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200"
          >
            <button
              role="option"
              aria-selected="true"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="es"
              data-label="ESPAÑOL"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >ES</span
                >
                Español
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="en-US"
              data-label="ENGLISH (US)"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >US</span
                >
                English (US)
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="en-GB"
              data-label="ENGLISH (UK)"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >UK</span
                >
                English (UK)
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="de"
              data-label="DEUTSCH"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >DE</span
                >
                Deutsch
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="fr"
              data-label="FRANÇAIS"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >FR</span
                >
                Français
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="it"
              data-label="ITALIANO"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >IT</span
                >
                Italiano
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="nl"
              data-label="NEDERLANDS"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >NL</span
                >
                Nederlands
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="pt-BR"
              data-label="PORTUGUÊS (BR)"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >BR</span
                >
                Português (BR)
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="pt-PT"
              data-label="PORTUGUÊS (PT)"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >PT</span
                >
                Português (PT)
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="ca-ES"
              data-label="CATALÀ"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >CA</span
                >
                Català
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="pl-PL"
              data-label="POLSKI"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >PL</span
                >
                Polski
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="sv"
              data-label="SVENSKA"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >SV</span
                >
                Svenska
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="ar"
              data-label="العربية"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >AR</span
                >
                العربية
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="ja-JP"
              data-label="日本語"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >JA</span
                >
                日本語
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
            <button
              role="option"
              aria-selected="false"
              class="dropdown-lang-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-lang="ru-RU"
              data-label="Русский"
            >
              <span class="flex items-center gap-2">
                <span
                  class="font-semibold text-[11px] px-1 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-500 dark:text-zinc-400"
                  >RU</span
                >
                Русский
              </span>
              <span
                class="lang-check material-symbols-outlined text-[16px] text-primary opacity-0"
                >check</span
              >
            </button>
          </div>
        </div>

        <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5"></div>

        <!-- 1. Botón Alternar entre Vista Previa y Editor -->
        <button
          id="toggleViewBtn"
          type="button"
          aria-label="Alternar entre editor y vista previa"
          class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300 disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed"
          title="Ver vista previa (Ctrl+Alt+P)"
        >
          <span
            id="toggleViewIcon"
            class="material-symbols-outlined text-[20px]"
            >chrome_reader_mode</span
          >
        </button>

        <!-- 2. Botón Alternar Vista Dividida (Split View) -->
        <button
          id="toggleSplitBtn"
          type="button"
          aria-label="Alternar vista dividida"
          aria-pressed="false"
          class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
          title="Alternar vista dividida (Ctrl+Alt+S)"
        >
          <span
            id="toggleSplitIcon"
            class="material-symbols-outlined text-[20px]"
            >vertical_split</span
          >
        </button>

        <!-- Botón para alternar/colapsar panel lateral -->
        <button
          id="toggleSidebarBtn"
          aria-label="Alternar panel lateral"
          class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
          title="Alternar panel lateral"
        >
          <span
            id="toggleSidebarIcon"
            class="material-symbols-outlined text-[20px]"
            >dock_to_left</span
          >
        </button>

        <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5 hidden @[600px]:block"></div>

        <!-- History, Search & Clipboard (visible en contenedores anchos >= 600px) -->
        <div class="hidden @[600px]:flex items-center gap-0.5">
          <button
            id="findReplaceBtn"
            type="button"
            aria-label="Buscar y reemplazar"
            class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
            title="Buscar y reemplazar (Ctrl+F)"
          >
            <span class="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button
            id="undoBtn"
            aria-label="Deshacer"
            class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
            title="Deshacer (Ctrl+Z)"
          >
            <span class="material-symbols-outlined text-[20px]">undo</span>
          </button>
          <button
            id="redoBtn"
            aria-label="Rehacer"
            class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
            title="Rehacer (Ctrl+Shift+Z)"
          >
            <span class="material-symbols-outlined text-[20px]">redo</span>
          </button>
          <button
            id="formatDocBtn"
            aria-label="Auto-formatear documento"
            class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
            title="Auto-formatear documento (Tab / Shift+Alt+F)"
          >
            <span class="material-symbols-outlined text-[20px]">auto_fix_high</span>
          </button>
          <button
            id="copyBtn"
            aria-label="Copiar"
            class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
            title="Copiar texto"
          >
            <span class="material-symbols-outlined text-[20px]"
              >content_copy</span
            >
          </button>
          <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5 shrink-0"></div>
          <button
            id="clearBtn"
            aria-label="Borrar"
            class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-red-500/70 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
            title="Limpiar contenido"
          >
            <span class="material-symbols-outlined text-[20px]"
              >delete</span
            >
          </button>
        </div>

        <!-- Más acciones (Dropdown compacto para contenedores < 600px) -->
        <div class="relative dropdown-container flex @[600px]:hidden">
          <button
            id="btnMoreActions"
            aria-label="Más acciones"
            aria-haspopup="menu"
            aria-expanded="false"
            class="dropdown-trigger flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-600 dark:text-zinc-300"
            title="Más acciones"
          >
            <span class="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
          <div
            id="menuMoreActions"
            role="menu"
            aria-orientation="vertical"
            aria-label="Más acciones"
            class="dropdown-menu hidden absolute top-full right-0 mt-1 z-50 w-48 bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200"
          >
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="findReplace"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">search</span>
                Buscar y reemplazar
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ctrl+F</span>
            </button>
            <div class="my-1 border-t border-zinc-200/60 dark:border-zinc-700/60"></div>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="undo"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">undo</span>
                Deshacer
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ctrl+Z</span>
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="redo"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">redo</span>
                Rehacer
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ctrl+Y</span>
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left text-primary font-medium"
              data-action="format"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">auto_fix_high</span>
                Auto-formatear
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Tab</span>
            </button>
            <div class="my-1 border-t border-zinc-200/60 dark:border-zinc-700/60"></div>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="copy"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">content_copy</span>
                Copiar texto
              </span>
            </button>

            <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5 hidden @[600px]:block"></div>

            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left text-red-500/80 dark:text-red-400"
              data-action="clear"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px]">delete</span>
                Limpiar editor
              </span>
            </button>
          </div>
        </div>
      </div>
    `.trim();
}
