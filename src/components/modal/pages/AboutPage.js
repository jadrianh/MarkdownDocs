/**
 * About & Shortcuts Page Template
 * Grouped system information and quick keyboard reference for end users.
 *
 * @returns {string} HTML markup string
 */
export function renderAboutPage() {
    return /* html */ `
      <div class="space-y-6">
        <!-- Group 1: Keyboard Shortcuts -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">keyboard</span>
              Atajos de Teclado Esenciales
            </h4>
            <span class="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">Comandos rápidos</span>
          </div>

          <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
            Agiliza tu flujo de redacción técnica mediante combinaciones de teclado estándar.
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-xs">
            <div class="flex items-center justify-between p-2 rounded border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <span class="text-zinc-600 dark:text-zinc-400 font-sans text-xs">Negrita</span>
              <kbd class="px-1.5 py-0.5 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 shadow-2xs font-mono">Ctrl + B</kbd>
            </div>
            <div class="flex items-center justify-between p-2 rounded border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <span class="text-zinc-600 dark:text-zinc-400 font-sans text-xs">Cursiva</span>
              <kbd class="px-1.5 py-0.5 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 shadow-2xs font-mono">Ctrl + I</kbd>
            </div>
            <div class="flex items-center justify-between p-2 rounded border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <span class="text-zinc-600 dark:text-zinc-400 font-sans text-xs">Insertar Enlace</span>
              <kbd class="px-1.5 py-0.5 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 shadow-2xs font-mono">Ctrl + K</kbd>
            </div>
            <div class="flex items-center justify-between p-2 rounded border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <span class="text-zinc-600 dark:text-zinc-400 font-sans text-xs">Código en Línea</span>
              <kbd class="px-1.5 py-0.5 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 shadow-2xs font-mono">Ctrl + Shift + C</kbd>
            </div>
            <div class="flex items-center justify-between p-2 rounded border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <span class="text-zinc-600 dark:text-zinc-400 font-sans text-xs">Alternar Vista</span>
              <kbd class="px-1.5 py-0.5 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 shadow-2xs font-mono">Ctrl + Shift + P</kbd>
            </div>
            <div class="flex items-center justify-between p-2 rounded border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
              <span class="text-zinc-600 dark:text-zinc-400 font-sans text-xs">Cerrar Ventana</span>
              <kbd class="px-1.5 py-0.5 text-[11px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300 shadow-2xs font-mono">Esc</kbd>
            </div>
          </div>
        </section>

        <!-- Divider -->
        <div class="border-t border-zinc-200/60 dark:border-zinc-800/80"></div>

        <!-- Group 2: About System -->
        <section class="space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="font-mono text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[15px]">info</span>
              Acerca de Markdown Docs
            </h4>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">v1.0.0</span>
          </div>

          <div class="p-3.5 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 space-y-2">
            <div class="flex items-center gap-2.5">
              <div class="w-6 h-6 rounded bg-zinc-800 dark:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center font-sans">
                Md
              </div>
              <span class="font-sans font-semibold text-xs text-zinc-900 dark:text-zinc-100">Precision Editorial Console</span>
            </div>
            <p class="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
              Plataforma de redacción y edición técnica con análisis lingüístico en tiempo real, soporte tipográfico avanzado y renderizado multiformato.
            </p>
          </div>
        </section>
      </div>
    `.trim();
}
