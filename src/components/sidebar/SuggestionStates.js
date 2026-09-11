/**
 * Suggestion States Template
 * Renders empty state, loading spinner, and error state for suggestions panel.
 */

export function renderEmptyState() {
    return /* html */ `
      <div
        id="emptyState"
        class="flex flex-col items-center justify-center p-6 text-center h-full"
      >
        <div
          class="w-14 h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-200/60 dark:border-zinc-700/50"
        >
          <span
            class="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-[30px]"
            >auto_awesome</span
          >
        </div>
        <p
          class="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wide uppercase"
        >
          Esperando texto...
        </p>
      </div>
    `.trim();
}

export function renderLoadingState() {
    return /* html */ `
      <div class="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 animate-pulse font-mono text-xs">
        <span class="material-symbols-outlined text-3xl mb-2 animate-spin">sync</span>
        <p class="tracking-wide uppercase">Analizando texto...</p>
      </div>
    `.trim();
}

export function renderErrorState(message = 'No se pudo conectar con el servicio de revisión. Verifica tu conexión a internet.') {
    return /* html */ `
      <div id="errorState" class="flex flex-col items-center justify-center text-center p-6 h-full font-mono text-xs">
        <div class="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mb-4 border border-red-200 dark:border-red-900/60">
          <span class="material-symbols-outlined text-red-500 dark:text-red-400 text-[24px]">cloud_off</span>
        </div>
        <h3 class="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm font-sans">Error de conexión</h3>
        <p class="text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed font-sans text-xs max-w-[220px]">
          ${message}
        </p>
        <button
          id="retryAnalysisBtn"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded font-sans text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
        >
          <span class="material-symbols-outlined text-[14px]">refresh</span>
          <span>Reintentar</span>
        </button>
      </div>
    `.trim();
}
