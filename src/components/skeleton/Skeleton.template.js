/**
 * Skeleton & Shimmer Templates
 * Placeholders de carga inicial y asíncrona para Navbar, Workspace y Sugerencias.
 */

export function renderNavbarSkeleton() {
    return /* html */ `
    <header
      id="app-header-root"
      class="relative z-20 flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-zinc-800 shadow-sm shrink-0 h-14"
      role="banner"
      aria-busy="true"
      aria-label="Cargando interfaz..."
    >
      <!-- Branding Skeleton -->
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg skeleton-shimmer shrink-0"></div>
        <div class="space-y-1.5">
          <div class="w-28 sm:w-36 h-3.5 rounded skeleton-shimmer"></div>
          <div class="w-16 sm:w-20 h-2.5 rounded skeleton-shimmer"></div>
        </div>
      </div>
      <!-- Actions Skeleton -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div class="hidden sm:block w-20 h-8 rounded-md skeleton-shimmer"></div>
        <div class="hidden sm:block w-20 h-8 rounded-md skeleton-shimmer"></div>
        <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-md skeleton-shimmer"></div>
        <div class="w-24 sm:w-28 h-8 sm:h-9 rounded-md skeleton-shimmer"></div>
      </div>
    </header>
    `.trim();
}

export function renderWorkspaceSkeleton() {
    return /* html */ `
    <div
      class="flex-1 flex overflow-hidden min-w-0"
      aria-busy="true"
    >
      <!-- Editor Column Skeleton -->
      <section class="flex-1 flex flex-col min-w-0 border-r border-zinc-200/60 dark:border-zinc-700/50 bg-white dark:bg-zinc-900">
        <!-- Toolbar Skeleton -->
        <div class="flex items-center justify-between px-3 border-b border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/50 shrink-0 h-10 select-none gap-2">
          <div class="flex items-center gap-1">
            <div class="w-16 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-7 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-7 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-12 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-12 h-7 rounded-sm skeleton-shimmer"></div>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-14 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-7 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-7 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-7 h-7 rounded-sm skeleton-shimmer"></div>
            <div class="w-7 h-7 rounded-sm skeleton-shimmer"></div>
          </div>
        </div>

        <!-- Editor Document Canvas Skeleton -->
        <div class="flex-1 p-6 sm:p-8 space-y-4 overflow-hidden bg-white dark:bg-zinc-900">
          <div class="w-2/5 max-w-xs h-7 rounded-md skeleton-shimmer mb-6"></div>
          <div class="space-y-2.5 max-w-3xl">
            <div class="w-11/12 h-3.5 rounded skeleton-shimmer"></div>
            <div class="w-full h-3.5 rounded skeleton-shimmer"></div>
            <div class="w-4/5 h-3.5 rounded skeleton-shimmer"></div>
            <div class="w-3/4 h-3.5 rounded skeleton-shimmer"></div>
          </div>
          <div class="w-1/4 max-w-[200px] h-5 rounded-md skeleton-shimmer pt-4 mb-2"></div>
          <div class="space-y-2.5 max-w-3xl">
            <div class="w-full h-3.5 rounded skeleton-shimmer"></div>
            <div class="w-5/6 h-3.5 rounded skeleton-shimmer"></div>
            <div class="w-3/5 h-3.5 rounded skeleton-shimmer"></div>
          </div>
          <div class="w-full max-w-2xl h-24 rounded-lg skeleton-shimmer opacity-60 mt-4"></div>
        </div>

        <!-- Footer Bar Skeleton -->
        <div class="h-7 border-t border-zinc-200/60 dark:border-zinc-700/50 bg-zinc-50/50 dark:bg-zinc-800/50 px-3 flex items-center justify-between shrink-0">
          <div class="w-32 h-3 rounded skeleton-shimmer"></div>
          <div class="w-40 h-3 rounded skeleton-shimmer"></div>
        </div>
      </section>

      <!-- Suggestions Sidebar Skeleton (Visible on md+ screens) -->
      <aside class="w-80 hidden md:flex flex-col bg-zinc-50 dark:bg-zinc-800 shrink-0 border-l border-zinc-200/60 dark:border-zinc-700/50">
        <div class="flex items-center justify-between px-4 py-2 border-b border-zinc-200/60 dark:border-zinc-700/50 h-10 shrink-0 bg-white dark:bg-zinc-800">
          <div class="w-28 h-3.5 rounded skeleton-shimmer"></div>
          <div class="w-5 h-5 rounded skeleton-shimmer"></div>
        </div>
        <div class="flex-1 p-4 space-y-3 overflow-hidden">
          <div class="p-3.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700/50 bg-white/60 dark:bg-zinc-800/40 space-y-2.5">
            <div class="w-20 h-3 rounded skeleton-shimmer"></div>
            <div class="w-full h-3 rounded skeleton-shimmer"></div>
            <div class="w-4/5 h-3 rounded skeleton-shimmer"></div>
            <div class="w-24 h-6 rounded-md skeleton-shimmer mt-2"></div>
          </div>
          <div class="p-3.5 rounded-lg border border-zinc-200/60 dark:border-zinc-700/50 bg-white/60 dark:bg-zinc-800/40 space-y-2.5">
            <div class="w-16 h-3 rounded skeleton-shimmer"></div>
            <div class="w-11/12 h-3 rounded skeleton-shimmer"></div>
            <div class="w-2/3 h-3 rounded skeleton-shimmer"></div>
            <div class="w-28 h-6 rounded-md skeleton-shimmer mt-2"></div>
          </div>
        </div>
      </aside>
    </div>
    `.trim();
}

export function renderSuggestionsSkeleton() {
    return /* html */ `
    <div class="space-y-3 p-1 animate-fade-in" aria-busy="true" aria-label="Analizando texto...">
      <div class="flex items-center justify-between pb-1">
        <span class="text-[11px] font-mono font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px] animate-spin text-primary">sync</span>
          Analizando documento...
        </span>
        <div class="w-12 h-3.5 rounded skeleton-shimmer"></div>
      </div>
      <div class="p-3.5 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/60 space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between">
          <div class="w-20 h-3.5 rounded skeleton-shimmer"></div>
          <div class="w-12 h-3 rounded skeleton-shimmer"></div>
        </div>
        <div class="space-y-1.5 pt-1">
          <div class="w-full h-3 rounded skeleton-shimmer"></div>
          <div class="w-4/5 h-3 rounded skeleton-shimmer"></div>
        </div>
        <div class="flex items-center gap-2 pt-1.5">
          <div class="w-24 h-6 rounded-md skeleton-shimmer"></div>
          <div class="w-16 h-6 rounded-md skeleton-shimmer"></div>
        </div>
      </div>
      <div class="p-3.5 rounded-lg border border-zinc-200/70 dark:border-zinc-700/60 bg-white/80 dark:bg-zinc-800/60 space-y-2.5 shadow-2xs">
        <div class="flex items-center justify-between">
          <div class="w-24 h-3.5 rounded skeleton-shimmer"></div>
          <div class="w-10 h-3 rounded skeleton-shimmer"></div>
        </div>
        <div class="space-y-1.5 pt-1">
          <div class="w-11/12 h-3 rounded skeleton-shimmer"></div>
          <div class="w-3/4 h-3 rounded skeleton-shimmer"></div>
        </div>
        <div class="flex items-center gap-2 pt-1.5">
          <div class="w-20 h-6 rounded-md skeleton-shimmer"></div>
        </div>
      </div>
    </div>
    `.trim();
}
