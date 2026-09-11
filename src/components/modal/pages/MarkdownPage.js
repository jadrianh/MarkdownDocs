/**
 * Helper to render a single Markdown dialect card
 *
 * @param {string} id - Flavor identifier ('gfm', 'academic', 'commonmark')
 * @param {string} icon - Material icon name
 * @param {string} title - Human readable title
 * @param {string} badge - Badge text
 * @param {string} desc - Description text
 * @param {boolean} isActive - Whether card is initially active
 * @returns {string} HTML markup string
 */
function renderFlavorCard(id, icon, title, badge, desc, isActive) {
    const activeClass = isActive ? 'active' : '';
    const badgeClass = id === 'gfm'
        ? 'bg-primary/10 text-primary border border-primary/20'
        : 'bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 border border-zinc-300/60 dark:border-zinc-600/60';

    return /* html */ `
      <button
        type="button"
        data-flavor="${id}"
        aria-pressed="${isActive ? 'true' : 'false'}"
        class="flavor-option-btn text-left p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-start gap-3.5 group cursor-pointer w-full ${activeClass}"
      >
        <div
          class="flavor-icon-box w-9 h-9 rounded-md bg-zinc-200/70 dark:bg-zinc-700/60 flex items-center justify-center shrink-0 mt-0.5 text-zinc-600 dark:text-zinc-300 transition-colors group-hover:text-primary"
        >
          <span class="material-symbols-outlined text-[20px]">${icon}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2">
            <span
              class="font-sans font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors"
              >${title}</span
            >
            <span
              class="text-[10px] font-mono px-2 py-0.5 rounded ${badgeClass} font-medium shrink-0"
              >${badge}</span
            >
          </div>
          <p
            class="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-1 leading-normal"
          >
            ${desc}
          </p>
        </div>
      </button>
    `.trim();
}

/**
 * Markdown Flavor Page Template
 * Dialect selector cards: GitHub (GFM), Academic & Scientific, CommonMark.
 *
 * @param {string} [activeFlavor='gfm'] - Active markdown flavor
 * @returns {string} HTML markup string
 */
export function renderMarkdownPage(activeFlavor = 'gfm') {
    return /* html */ `
      <div class="space-y-6">
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">integration_instructions</span>
              Motor y Dialecto Markdown
            </h4>
            <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">Sintaxis activa</span>
          </div>

          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Selecciona la gramática de análisis y las extensiones funcionales que se aplicarán al renderizar el documento.
          </p>

          <div class="flex flex-col gap-2.5 pt-1" id="markdownFlavorOptions">
            ${renderFlavorCard(
                'gfm',
                'terminal',
                'GitHub (GFM)',
                'Predeterminado',
                'Soporta tablas GFM, listas de verificación, alertas GitHub (NOTE, TIP, WARNING) y saltos de línea automáticos.',
                activeFlavor === 'gfm'
            )}
            ${renderFlavorCard(
                'academic',
                'functions',
                'Académico y Científico',
                'LaTeX + KaTeX',
                'Fórmulas matemáticas KaTeX ($E=mc^2$), notas al pie de página ([^1]) y citas bibliográficas estructuradas.',
                activeFlavor === 'academic'
            )}
            ${renderFlavorCard(
                'commonmark',
                'check_circle',
                'CommonMark Estricto',
                'Estándar Universal',
                'Especificación universal rigurosa sin extensiones propietarias para garantizar máxima portabilidad internacional.',
                activeFlavor === 'commonmark'
            )}
          </div>
        </section>
      </div>
    `.trim();
}
