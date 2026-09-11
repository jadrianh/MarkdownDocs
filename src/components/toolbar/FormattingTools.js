/**
 * Formatting Tools Template
 * Text styles, bold, italic, strikethrough/code, lists, and insert elements dropdowns.
 *
 * @returns {string} HTML markup string
 */
export function renderFormattingTools() {
    return /* html */ `
      <div class="flex items-center gap-0.5 text-xs shrink-0">
        <!-- 1. Estilos de texto (Dropdown Button) -->
        <div class="relative dropdown-container">
          <button
            id="btnTextStyles"
            aria-label="Estilos de texto"
            aria-haspopup="menu"
            aria-expanded="false"
            class="dropdown-trigger flex items-center justify-center gap-0.5 px-1.5 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
            title="Estilos de texto"
          >
            <span class="material-symbols-outlined text-[20px]"
              >text_fields</span
            >
            <span
              class="material-symbols-outlined text-[18px] text-zinc-400 -ml-0.5"
              >arrow_drop_down</span
            >
          </button>
          <div
            id="menuTextStyles"
            role="menu"
            aria-orientation="vertical"
            aria-label="Estilos de texto"
            class="dropdown-menu hidden absolute top-full left-0 mt-1 z-50 w-52 bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200"
          >
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="header"
              data-value="0"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >short_text</span
                >
                Texto normal
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+0</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="header"
              data-value="1"
            >
              <span class="flex items-center gap-2 font-bold">
                <span class="material-symbols-outlined text-[18px]"
                  >title</span
                >
                Título 1
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+1</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="header"
              data-value="2"
            >
              <span class="flex items-center gap-2 font-bold">
                <span class="material-symbols-outlined text-[18px]"
                  >title</span
                >
                Título 2
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+2</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="header"
              data-value="3"
            >
              <span class="flex items-center gap-2 font-bold">
                <span class="material-symbols-outlined text-[18px]"
                  >title</span
                >
                Título 3
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+3</span
              >
            </button>
          </div>
        </div>

        <!-- 2. Negrita (Ctrl+B) -->
        <button
          id="btnBold"
          aria-label="Negrita (Ctrl+B)"
          class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
          title="Negrita (Ctrl+B)"
        >
          <span class="material-symbols-outlined text-[20px] font-bold"
            >format_bold</span
          >
        </button>

        <!-- 3. Cursiva (Ctrl+I) -->
        <button
          id="btnItalic"
          aria-label="Cursiva (Ctrl+I)"
          class="flex items-center justify-center w-8 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
          title="Cursiva (Ctrl+I)"
        >
          <span class="material-symbols-outlined text-[20px] italic"
            >format_italic</span
          >
        </button>

        <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5"></div>

        <!-- 4. Más formatos (Dropdown Button) -->
        <div class="relative dropdown-container">
          <button
            id="btnMoreFormats"
            aria-label="Más formatos"
            aria-haspopup="menu"
            aria-expanded="false"
            class="dropdown-trigger flex items-center justify-center gap-0.5 px-1.5 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
            title="Más formatos"
          >
            <span class="material-symbols-outlined text-[20px]"
              >more_horiz</span
            >
            <span
              class="material-symbols-outlined text-[18px] text-zinc-400 -ml-0.5"
              >arrow_drop_down</span
            >
          </button>
          <div
            id="menuMoreFormats"
            role="menu"
            aria-orientation="vertical"
            aria-label="Más formatos"
            class="dropdown-menu hidden absolute top-full left-0 mt-1 z-50 w-56 bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200"
          >
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="moreFormat"
              data-value="strikethrough"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >strikethrough_s</span
                >
                Tachado
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Shift+S</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="moreFormat"
              data-value="code"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >code</span
                >
                Código
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Shift+M</span
              >
            </button>
            <div
              class="my-1 border-t border-zinc-200/60 dark:border-zinc-700/60"
            ></div>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left text-red-500/80 dark:text-red-400"
              data-action="moreFormat"
              data-value="clear"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >format_clear</span
                >
                Borrar Formato
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+\</span
              >
            </button>
            <div class="@[480px]:hidden my-1 border-t border-zinc-200/60 dark:border-zinc-700/60"></div>
            <button
              role="menuitem"
              class="dropdown-item @[480px]:hidden w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="insertElement"
              data-value="link"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">link</span>
                Vínculo
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ctrl+Alt+4</span>
            </button>
            <button
              role="menuitem"
              class="dropdown-item @[480px]:hidden w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="insertElement"
              data-value="codeblock"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">code_blocks</span>
                Fragmento de código
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ctrl+Alt+5</span>
            </button>
            <button
              role="menuitem"
              class="dropdown-item @[480px]:hidden w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="insertElement"
              data-value="quote"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">format_quote</span>
                Citar
              </span>
              <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">Ctrl+Alt+6</span>
            </button>
          </div>
        </div>

        <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5 hidden @[380px]:block"></div>

        <!-- 5. Listas (Dropdown Button) -->
        <div class="relative dropdown-container hidden @[380px]:block">
          <button
            id="btnListStyle"
            aria-label="Listas"
            aria-haspopup="menu"
            aria-expanded="false"
            class="dropdown-trigger flex items-center justify-center gap-0.5 px-1.5 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
            title="Listas"
          >
            <span class="material-symbols-outlined text-[20px]"
              >format_list_bulleted</span
            >
            <span
              class="material-symbols-outlined text-[18px] text-zinc-400 -ml-0.5"
              >arrow_drop_down</span
            >
          </button>
          <div
            id="menuListStyle"
            role="menu"
            aria-orientation="vertical"
            aria-label="Estilos de lista"
            class="dropdown-menu hidden absolute top-full left-0 mt-1 z-50 w-56 bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200"
          >
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="listStyle"
              data-value="unordered"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >format_list_bulleted</span
                >
                Lista de viñetas
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Shift+L</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="listStyle"
              data-value="ordered"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >format_list_numbered</span
                >
                Lista numérica
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Shift+N</span
              >
            </button>
          </div>
        </div>

        <div class="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5 hidden @[480px]:block"></div>

        <!-- 6. Insertar Elementos (Dropdown Button) -->
        <div class="relative dropdown-container hidden @[480px]:block">
          <button
            id="btnInsertElement"
            aria-label="Insertar Elementos"
            aria-haspopup="menu"
            aria-expanded="false"
            class="dropdown-trigger flex items-center justify-center gap-0.5 px-1.5 h-8 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 rounded-sm transition-colors text-zinc-700 dark:text-zinc-300"
            title="Insertar Elementos"
          >
            <span class="material-symbols-outlined text-[20px]"
              >add_box</span
            >
            <span
              class="material-symbols-outlined text-[18px] text-zinc-400 -ml-0.5"
              >arrow_drop_down</span
            >
          </button>
          <div
            id="menuInsertElement"
            role="menu"
            aria-orientation="vertical"
            aria-label="Insertar elementos"
            class="dropdown-menu hidden absolute top-full left-0 mt-1 z-50 w-60 bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 rounded shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200"
          >
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="insertElement"
              data-value="link"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >link</span
                >
                Vínculo
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+4</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="insertElement"
              data-value="codeblock"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >code_blocks</span
                >
                Fragmento de código
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+5</span
              >
            </button>
            <button
              role="menuitem"
              class="dropdown-item w-full flex items-center justify-between px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors text-left"
              data-action="insertElement"
              data-value="quote"
            >
              <span class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]"
                  >format_quote</span
                >
                Citar
              </span>
              <span
                class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                >Ctrl+Alt+6</span
              >
            </button>
          </div>
        </div>
      </div>
    `.trim();
}
