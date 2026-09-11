/**
 * Typography Page Template
 * Font family selectors, size sliders, and live interactive sample previews for Editor and Preview panes.
 *
 * @returns {string} HTML markup string
 */
export function renderTypographyPage() {
    return /* html */ `
      <div class="space-y-6">
        <!-- Group 1: Editor Typography -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">edit_note</span>
              Editor de Código y Redacción
            </h4>
            <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">Monoespaciado</span>
          </div>

          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Ajusta la familia tipográfica monoespaciada y la escala de caracteres en el área de escritura de Markdown.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Font Family -->
            <div class="flex flex-col gap-1.5">
              <label for="editorFontFamily" class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Familia de Fuente
              </label>
              <div class="relative">
                <select
                  id="editorFontFamily"
                  class="pref-select w-full appearance-none bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 pr-8 font-mono text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                >
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                  <option value="'Fira Code', monospace">Fira Code</option>
                  <option value="ui-monospace, monospace">Monospace (Sistema)</option>
                  <option value="'Hanken Grotesk', sans-serif">Hanken Grotesk</option>
                </select>
                <span class="material-symbols-outlined text-[16px] text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">arrow_drop_down</span>
              </div>
            </div>

            <!-- Font Size -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label for="editorFontSize" class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Tamaño de Fuente
                </label>
                <span id="editorFontSizeValue" class="text-primary font-mono font-semibold text-xs tabular-nums">14px</span>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <span class="text-zinc-400 text-[10px] font-mono">10</span>
                <input
                  id="editorFontSize"
                  type="range"
                  min="10"
                  max="24"
                  step="1"
                  value="14"
                  class="pref-range flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-zinc-200 dark:bg-zinc-700"
                />
                <span class="text-zinc-400 text-[10px] font-mono">24</span>
              </div>
            </div>
          </div>

          <!-- Live Sample Preview -->
          <div class="p-3 rounded border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
            <div class="text-[10px] uppercase font-mono text-zinc-400 mb-1.5">Muestra en vivo del editor:</div>
            <pre id="editorFontSample" class="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre font-mono"># Redacción Técnica
function calibrarEditor() {
    return { precision: true, estado: "activo" };
}</pre>
          </div>
        </section>

        <!-- Divider -->
        <div class="border-t border-zinc-200/60 dark:border-zinc-800/80"></div>

        <!-- Group 2: Preview Typography -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">chrome_reader_mode</span>
              Vista Previa y Lectura
            </h4>
            <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">Proporcional</span>
          </div>

          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Define la tipografía editorial aplicada al renderizado final de documentos HTML y exportación en PDF.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <!-- Preview Font Family -->
            <div class="flex flex-col gap-1.5">
              <label for="previewFontFamily" class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Familia de Fuente
              </label>
              <div class="relative">
                <select
                  id="previewFontFamily"
                  class="pref-select w-full appearance-none bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-2 pr-8 font-mono text-xs text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
                >
                  <option value="'Hanken Grotesk', sans-serif">Hanken Grotesk (Sans)</option>
                  <option value="'Merriweather', serif">Merriweather (Serif)</option>
                  <option value="ui-serif, serif">Serif (Sistema)</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono (Mono)</option>
                  <option value="'Source Code Pro', monospace">Source Code Pro</option>
                </select>
                <span class="material-symbols-outlined text-[16px] text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">arrow_drop_down</span>
              </div>
            </div>

            <!-- Preview Font Size -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center justify-between">
                <label for="previewFontSize" class="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  Tamaño de Fuente
                </label>
                <span id="previewFontSizeValue" class="text-primary font-mono font-semibold text-xs tabular-nums">15px</span>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <span class="text-zinc-400 text-[10px] font-mono">10</span>
                <input
                  id="previewFontSize"
                  type="range"
                  min="10"
                  max="24"
                  step="1"
                  value="15"
                  class="pref-range flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-zinc-200 dark:bg-zinc-700"
                />
                <span class="text-zinc-400 text-[10px] font-mono">24</span>
              </div>
            </div>
          </div>

          <!-- Live Sample Preview -->
          <div class="p-3 rounded border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40">
            <div class="text-[10px] uppercase font-mono text-zinc-400 mb-1.5">Muestra en vivo de la vista previa:</div>
            <p id="previewFontSample" class="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">
              La tipografía de lectura debe transmitir claridad estructural y serenidad óptica, permitiendo una rápida absorción conceptual en documentos extensos.
            </p>
          </div>
        </section>
      </div>
    `.trim();
}
