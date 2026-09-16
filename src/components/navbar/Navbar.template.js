/**
 * Top Navigation Bar Template
 * Includes branding, file import, export dropdown (.md, .pdf), theme button, and grammar analysis trigger.
 *
 * @returns {string} HTML markup string
 */
export function renderNavbar() {
    return /* html */ `
    <!-- BEGIN: Top Navigation Bar -->
    <header
      id="app-header-root"
      class="relative z-20 flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 shadow-sm shrink-0 h-14 transition-colors duration-200 animate-fade-in"
      role="banner"
      aria-label="Barra de herramientas principal"
      data-purpose="main-header"
    >
      <!-- Branding -->
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-zinc-800 dark:bg-zinc-700 rounded-lg flex items-center justify-center text-white dark:text-zinc-100 font-bold text-sm">
          Md
        </div>
        <div>
          <h1 class="text-m font-semibold leading-tight text-zinc-900 dark:text-zinc-100">Markdown Docs</h1>
          <p class="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Editor Inteligente</p>
        </div>
      </div>
      <!-- Actions -->
      <div class="flex items-center gap-1.5 sm:gap-2 text-sm font-medium shrink-0">
        <input
          type="file"
          id="importFileInput"
          accept=".md,.markdown,text/markdown"
          class="hidden"
        />

        <button
          id="importMdBtn"
          aria-label="Importar archivo Markdown (.md)"
          class="header-nav-btn flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-zinc-600 dark:text-zinc-300 rounded-md transition-all group cursor-pointer"
          title="Importar archivo Markdown (.md)"
        >
          <span class="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform duration-150"
            >file_save</span
          >
          <span class="text-xs font-semibold hidden md:inline group-hover:text-primary transition-colors">IMPORTAR</span>
        </button>

        <!-- Download Dropdown -->
        <div class="relative dropdown-container">
          <button
            id="btnDownloadDropdown"
            aria-label="Opciones de descarga"
            aria-haspopup="menu"
            aria-expanded="false"
            class="header-nav-btn dropdown-trigger flex items-center justify-center gap-1 px-2.5 sm:px-3.5 py-1.5 text-zinc-600 dark:text-zinc-300 rounded-md transition-all group cursor-pointer"
            title="Exportar documento"
          >
            <span class="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform duration-150"
              >file_export</span
            >
            <span class="text-xs font-semibold uppercase hidden md:inline group-hover:text-primary transition-colors">Exportar</span>
            <span class="material-symbols-outlined text-[18px] text-zinc-400 group-hover:text-primary transition-colors"
              >arrow_drop_down</span
            >
          </button>
          <div
            id="menuDownload"
            role="menu"
            aria-orientation="vertical"
            aria-label="Opciones de exportación"
            class="dropdown-menu hidden absolute top-full right-0 sm:left-0 mt-1.5 z-50 w-52 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/80 rounded-lg shadow-xl py-1 font-mono text-xs text-zinc-700 dark:text-zinc-200 transition-all"
          >
            <button
              id="downloadMdBtn"
              role="menuitem"
              class="dropdown-item w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left group"
            >
              <span class="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform"
                >description</span
              >
              <div class="flex flex-col">
                <span
                  class="font-sans font-semibold text-xs text-zinc-800 dark:text-zinc-100 group-hover:text-primary transition-colors"
                  >Markdown (.md)</span
                >
                <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                  >Texto plano</span
                >
              </div>
            </button>
            <button
              id="downloadPdfBtn"
              role="menuitem"
              class="dropdown-item w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left group"
            >
              <span class="material-symbols-outlined text-[20px] text-red-500 group-hover:scale-110 transition-transform"
                >picture_as_pdf</span
              >
              <div class="flex flex-col">
                <span
                  class="font-sans font-semibold text-xs text-zinc-800 dark:text-zinc-100 group-hover:text-red-500 transition-colors"
                  >Documento PDF</span
                >
                <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono"
                  >Con estilo preview</span
                >
              </div>
            </button>
          </div>
        </div>

        <div class="w-px h-5 bg-zinc-200/80 dark:bg-zinc-700/80 mx-0.5 sm:mx-1 transition-colors duration-200"></div>

        <button
          id="themeSettingsBtn"
          aria-label="Preferencias de tema"
          class="header-nav-btn relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-zinc-600 dark:text-zinc-300 rounded-md transition-all group cursor-pointer"
          title="Preferencias de tema y color"
        >
          <span class="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:rotate-45 transition-transform duration-300">settings</span>
        </button>

        <button
          id="analyzeBtn"
          aria-label="Analizar texto"
          class="relative flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-200 font-mono text-xs uppercase tracking-wider font-semibold cursor-pointer select-none group"
        >
          <span class="material-symbols-outlined text-[20px] sm:text-[22px] transition-transform duration-200 group-hover:scale-115 group-hover:rotate-12 inline-block"
            >auto_awesome</span
          >
          <span class="text-xs sm:text-[14px]">ANALIZAR</span>
        </button>
      </div>
    </header>
    <!-- END: Top Navigation Bar -->
    `.trim();
}
