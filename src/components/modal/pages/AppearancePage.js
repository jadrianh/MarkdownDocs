/**
 * Appearance Page Template
 * Grouped visual settings: Interface Theme (Light, Dark, OLED Black) and Accent Palette.
 *
 * @returns {string} HTML markup string
 */
export function renderAppearancePage() {
    return /* html */ `
      <div class="space-y-6">
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">dark_mode</span>
              Tema de Interfaz
            </h4>
            <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">Selección directa</span>
          </div>

          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Elige el ambiente cromático que mejor se adapte a tu iluminación y preferencia de lectura.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1" role="radiogroup" aria-label="Tema de color">
            <!-- Light Mode Option -->
            <button
              type="button"
              class="theme-option-btn flex flex-row sm:flex-col items-center sm:items-stretch gap-3 p-2.5 sm:p-3 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-left cursor-pointer group"
              data-mode="light"
              role="radio"
              aria-label="Tema Claro"
            >
              <!-- Mini UI Window Preview -->
              <div class="theme-preview-window w-16 h-12 sm:w-full sm:h-16 rounded-md bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/90 dark:border-zinc-700/70 flex flex-col overflow-hidden shadow-2xs shrink-0 transition-transform group-hover:scale-[1.02]">
                <div class="h-4 bg-zinc-200/80 dark:bg-zinc-700/50 border-b border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between px-1.5 shrink-0">
                  <div class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"></span>
                  </div>
                  <span class="material-symbols-outlined text-[12px] text-zinc-500 dark:text-zinc-400">light_mode</span>
                </div>
                <div class="flex-1 bg-white p-1.5 flex gap-1.5">
                  <div class="flex-1 flex flex-col gap-1 justify-center">
                    <div class="h-1 w-4/5 rounded-xs bg-zinc-400/80"></div>
                    <div class="h-1 w-3/5 rounded-xs bg-zinc-200"></div>
                    <div class="h-1 w-full rounded-xs bg-zinc-200"></div>
                  </div>
                  <div class="w-px bg-zinc-100 shrink-0"></div>
                  <div class="flex-1 flex flex-col gap-1 justify-center">
                    <div class="h-1 w-full rounded-xs bg-zinc-400/60"></div>
                    <div class="h-1 w-2/3 rounded-xs bg-zinc-200"></div>
                  </div>
                </div>
              </div>

              <!-- Label & Radio Indicator -->
              <div class="flex items-center justify-between w-full min-w-0">
                <div class="min-w-0">
                  <span class="font-sans text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">Claro</span>
                  <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block truncate">Luz y fondo blanco</span>
                </div>
                <div class="theme-radio-dot w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center shrink-0 ml-2">
                  <div class="w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity"></div>
                </div>
              </div>
            </button>

            <!-- Dark Mode Option -->
            <button
              type="button"
              class="theme-option-btn flex flex-row sm:flex-col items-center sm:items-stretch gap-3 p-2.5 sm:p-3 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-left cursor-pointer group"
              data-mode="dark"
              role="radio"
              aria-label="Tema Oscuro"
            >
              <!-- Mini UI Window Preview -->
              <div class="theme-preview-window w-16 h-12 sm:w-full sm:h-16 rounded-md bg-zinc-800 border border-zinc-700 flex flex-col overflow-hidden shadow-2xs shrink-0 transition-transform group-hover:scale-[1.02]">
                <div class="h-4 bg-zinc-700/70 border-b border-zinc-700 flex items-center justify-between px-1.5 shrink-0">
                  <div class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                  </div>
                  <span class="material-symbols-outlined text-[12px] text-zinc-400">dark_mode</span>
                </div>
                <div class="flex-1 bg-zinc-900 p-1.5 flex gap-1.5">
                  <div class="flex-1 flex flex-col gap-1 justify-center">
                    <div class="h-1 w-4/5 rounded-xs bg-zinc-500"></div>
                    <div class="h-1 w-3/5 rounded-xs bg-zinc-700"></div>
                    <div class="h-1 w-full rounded-xs bg-zinc-700"></div>
                  </div>
                  <div class="w-px bg-zinc-800 shrink-0"></div>
                  <div class="flex-1 flex flex-col gap-1 justify-center">
                    <div class="h-1 w-full rounded-xs bg-zinc-500"></div>
                    <div class="h-1 w-2/3 rounded-xs bg-zinc-700"></div>
                  </div>
                </div>
              </div>

              <!-- Label & Radio Indicator -->
              <div class="flex items-center justify-between w-full min-w-0">
                <div class="min-w-0">
                  <span class="font-sans text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">Oscuro</span>
                  <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block truncate">Grafito equilibrado</span>
                </div>
                <div class="theme-radio-dot w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center shrink-0 ml-2">
                  <div class="w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity"></div>
                </div>
              </div>
            </button>

            <!-- Black Mode Option -->
            <button
              type="button"
              class="theme-option-btn flex flex-row sm:flex-col items-center sm:items-stretch gap-3 p-2.5 sm:p-3 rounded-lg border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/60 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-left cursor-pointer group"
              data-mode="black"
              role="radio"
              aria-label="Tema Noche OLED"
            >
              <!-- Mini UI Window Preview -->
              <div class="theme-preview-window w-16 h-12 sm:w-full sm:h-16 rounded-md bg-black border border-zinc-800 flex flex-col overflow-hidden shadow-2xs shrink-0 transition-transform group-hover:scale-[1.02]">
                <div class="h-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-1.5 shrink-0">
                  <div class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                    <span class="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                  </div>
                  <span class="material-symbols-outlined text-[12px] text-zinc-400">nightlight</span>
                </div>
                <div class="flex-1 bg-black p-1.5 flex gap-1.5">
                  <div class="flex-1 flex flex-col gap-1 justify-center">
                    <div class="h-1 w-4/5 rounded-xs bg-zinc-600"></div>
                    <div class="h-1 w-3/5 rounded-xs bg-zinc-800"></div>
                    <div class="h-1 w-full rounded-xs bg-zinc-800"></div>
                  </div>
                  <div class="w-px bg-zinc-900 shrink-0"></div>
                  <div class="flex-1 flex flex-col gap-1 justify-center">
                    <div class="h-1 w-full rounded-xs bg-zinc-600"></div>
                    <div class="h-1 w-2/3 rounded-xs bg-zinc-800"></div>
                  </div>
                </div>
              </div>

              <!-- Label & Radio Indicator -->
              <div class="flex items-center justify-between w-full min-w-0">
                <div class="min-w-0">
                  <span class="font-sans text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">Noche (OLED)</span>
                  <span class="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono block truncate">Negro puro y contraste</span>
                </div>
                <div class="theme-radio-dot w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center shrink-0 ml-2">
                  <div class="w-2 h-2 rounded-full bg-primary opacity-0 transition-opacity"></div>
                </div>
              </div>
            </button>
          </div>
        </section>

        <!-- Divider -->
        <div class="border-t border-zinc-200/60 dark:border-zinc-800/80"></div>

        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">palette</span>
              Color de Énfasis
            </h4>
            <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">5 acentos activos</span>
          </div>

          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Define el color principal de la marca, los botones de acción, los estados activos y los enlaces en la vista previa.
          </p>

          <div class="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
            <button
              type="button"
              class="color-btn w-8 h-8 rounded-full bg-[#4f46e5] hover:scale-110 transition-transform cursor-pointer"
              data-color="79 70 229"
              aria-label="Color Índigo"
              title="Índigo (Predeterminado)"
            ></button>
            <button
              type="button"
              class="color-btn w-8 h-8 rounded-full bg-[#3b82f6] hover:scale-110 transition-transform cursor-pointer"
              data-color="59 130 246"
              aria-label="Color Azul"
              title="Azul Técnico"
            ></button>
            <button
              type="button"
              class="color-btn w-8 h-8 rounded-full bg-[#10b981] hover:scale-110 transition-transform cursor-pointer"
              data-color="16 185 129"
              aria-label="Color Esmeralda"
              title="Esmeralda Orgánico"
            ></button>
            <button
              type="button"
              class="color-btn w-8 h-8 rounded-full bg-[#f59e0b] hover:scale-110 transition-transform cursor-pointer"
              data-color="245 158 11"
              aria-label="Color Ámbar"
              title="Ámbar Solar"
            ></button>
            <button
              type="button"
              class="color-btn w-8 h-8 rounded-full bg-[#f43f5e] hover:scale-110 transition-transform cursor-pointer"
              data-color="244 63 94"
              aria-label="Color Rosa"
              title="Rosa Carmesí"
            ></button>
          </div>
        </section>
      </div>
    `.trim();
}
