export const GrammarView = {
    elements: {},

    init() {
        this.elements = {
            resultsPanel: document.getElementById('resultsPanel'),
            suggestionsSidebar: document.getElementById('suggestionsSidebar'),
            sidebarBackdrop: document.getElementById('sidebarBackdrop'),
            suggestionsBadge: document.getElementById('suggestionsBadge'),
            toggleSidebarBtn: document.getElementById('toggleSidebarBtn'),
            closeSidebarBtn: document.getElementById('closeSidebarBtn'),
            toggleSidebarIcon: document.getElementById('toggleSidebarIcon')
        };
    },

    updateSidebarUI(isOpen) {
        const { suggestionsSidebar, sidebarBackdrop, toggleSidebarBtn, toggleSidebarIcon } = this.elements;
        if (!suggestionsSidebar) return;

        const isMobile = window.innerWidth < 768;

        if (isOpen) {
            suggestionsSidebar.classList.remove('sidebar-closed');
            toggleSidebarBtn?.classList.add('text-primary');
            toggleSidebarIcon?.classList.add('text-primary');
            if (isMobile && sidebarBackdrop) {
                sidebarBackdrop.classList.remove('hidden');
            }
        } else {
            suggestionsSidebar.classList.add('sidebar-closed');
            toggleSidebarBtn?.classList.remove('text-primary');
            toggleSidebarIcon?.classList.remove('text-primary');
            if (sidebarBackdrop) {
                sidebarBackdrop.classList.add('hidden');
            }
        }
    },

    toggleLoading(isLoading) {
        if (isLoading) {
            if (this.elements.suggestionsBadge) {
                this.elements.suggestionsBadge.classList.add('hidden');
            }
            this.elements.resultsPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 animate-pulse font-mono text-xs">
                    <span class="material-symbols-outlined text-3xl mb-2 animate-spin">sync</span>
                    <p class="tracking-wide uppercase">Analizando texto...</p>
                </div>`;
        }
    },

    renderEmptyState() {
        if (this.elements.suggestionsBadge) {
            this.elements.suggestionsBadge.classList.add('hidden');
        }
        this.elements.resultsPanel.innerHTML = `
            <div id="emptyState" class="flex flex-col items-center justify-center text-center p-6 h-full">
                <div class="w-14 h-14 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-200/60 dark:border-zinc-700/50">
                    <span class="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-[24px]">auto_awesome</span>
                </div>
                <p class="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">Esperando texto...</p>
            </div>`;
    },

    renderErrorState(message, onRetry) {
        if (this.elements.suggestionsBadge) {
            this.elements.suggestionsBadge.classList.add('hidden');
        }
        this.elements.resultsPanel.innerHTML = `
            <div id="errorState" class="flex flex-col items-center justify-center text-center p-6 h-full font-mono text-xs">
                <div class="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mb-4 border border-red-200 dark:border-red-900/60">
                    <span class="material-symbols-outlined text-red-500 dark:text-red-400 text-[24px]">cloud_off</span>
                </div>
                <h3 class="font-bold text-zinc-800 dark:text-zinc-200 mb-1.5 text-sm font-sans">Error de conexión</h3>
                <p class="text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed font-sans text-xs max-w-[220px]">
                    ${message || "No se pudo conectar con el servicio de revisión. Verifica tu conexión a internet."}
                </p>
                <button
                    id="retryAnalysisBtn"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded font-sans text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
                >
                    <span class="material-symbols-outlined text-[14px]">refresh</span>
                    <span>Reintentar</span>
                </button>
            </div>`;

        const retryBtn = document.getElementById('retryAnalysisBtn');
        if (retryBtn && onRetry) {
            retryBtn.addEventListener('click', () => onRetry());
        }
    },

    renderMatches(matches, onFixClick, onIgnoreClick, onSelectCard) {
        this.elements.resultsPanel.innerHTML = '';

        if (!matches || matches.length === 0) {
            if (this.elements.suggestionsBadge) {
                this.elements.suggestionsBadge.classList.add('hidden');
            }
            this.elements.resultsPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-emerald-600 dark:text-emerald-400 font-mono text-xs text-center p-6">
                    <span class="material-symbols-outlined text-5xl mb-2">check_circle</span>
                    <p class="font-semibold uppercase tracking-wider">¡Texto impecable!</p>
                </div>`;
            return;
        }

        if (this.elements.suggestionsBadge) {
            this.elements.suggestionsBadge.textContent = String(matches.length);
            this.elements.suggestionsBadge.classList.remove('hidden');
        }

        matches.forEach((match, idx) => {
            const card = document.createElement('div');
            card.className = 'suggestion-card bg-white dark:bg-zinc-900 p-4 rounded border border-zinc-200 dark:border-zinc-800 shadow-sm mb-3 font-mono text-xs';
            card.dataset.index = idx;
            card.title = 'Haz clic para ubicar en el editor';

            const contextText = match.context.text;
            const errorOffsetInContext = match.context.offset;
            const errorLength = match.context.length;
            
            const pre = contextText.substring(0, errorOffsetInContext);
            const err = contextText.substring(errorOffsetInContext, errorOffsetInContext + errorLength);
            const post = contextText.substring(errorOffsetInContext + errorLength);

            const highlightedContext = `...${pre}<span class="bg-red-500/10 text-red-600 dark:text-red-400 font-semibold px-1 rounded underline decoration-wavy underline-offset-2">${err}</span>${post}...`;

            const hasReplacements = match.replacements && match.replacements.length > 0;
            const buttons = hasReplacements
                ? match.replacements.slice(0, 3).map(rep =>
                    `<button class="fix-btn text-xs px-2.5 py-1 rounded font-mono font-medium transition-all" 
                        data-index="${idx}" 
                        data-rep="${rep.value}">
                        ${rep.value}
                     </button>`
                  ).join('')
                : `<span class="text-xs text-zinc-400 dark:text-zinc-500 italic">Sin sugerencias automáticas</span>`;

            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px]">error</span> CORRECCIÓN
                    </span>
                    <button
                        class="ignore-btn text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center"
                        data-index="${idx}"
                        title="Descartar sugerencia"
                        aria-label="Descartar sugerencia"
                    >
                        <span class="material-symbols-outlined text-[14px] pointer-events-none">close</span>
                    </button>
                </div>
                <div class="suggestion-context text-xs text-zinc-700 dark:text-zinc-300 mb-2 font-mono leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded border border-zinc-100 dark:border-zinc-800/80">
                    "${highlightedContext}"
                </div>
                <div class="text-xs text-zinc-500 dark:text-zinc-400 mb-3">${match.message}</div>
                <div class="flex flex-wrap items-center gap-1.5">${buttons}</div>
            `;

            // Clic en la tarjeta ubica el error en el editor
            card.addEventListener('click', (e) => {
                // Si el clic fue en un botón de reemplazo o en ignorar, no disparar selección de tarjeta
                if (e.target.closest('.fix-btn') || e.target.closest('.ignore-btn')) {
                    return;
                }
                if (onSelectCard) onSelectCard(idx);
            });

            this.elements.resultsPanel.appendChild(card);
        });

        // Botones de reemplazo rápido
        this.elements.resultsPanel.querySelectorAll('.fix-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index, 10);
                const replacement = btn.dataset.rep;
                if (onFixClick) onFixClick(index, replacement);
            });
        });

        // Botones de ignorar/descartar
        this.elements.resultsPanel.querySelectorAll('.ignore-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index, 10);
                if (onIgnoreClick) onIgnoreClick(index);
            });
        });
    }
};