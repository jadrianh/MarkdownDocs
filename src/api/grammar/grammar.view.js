export const GrammarView = {
    elements: {
        resultsPanel: document.getElementById('resultsPanel')
    },

    toggleLoading(isLoading) {
        if (isLoading) {
            this.elements.resultsPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-500 animate-pulse font-mono text-xs">
                    <span class="material-symbols-outlined text-3xl mb-2 animate-spin">sync</span>
                    <p class="tracking-wide uppercase">Analizando texto...</p>
                </div>`;
        }
    },

    renderEmptyState() {
        this.elements.resultsPanel.innerHTML = `
            <div id="emptyState" class="flex flex-col items-center justify-center text-center p-6 h-full">
                <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 border border-zinc-200/60 dark:border-zinc-700/50">
                    <span class="material-symbols-outlined text-zinc-400 dark:text-zinc-500">auto_awesome</span>
                </div>
                <p class="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wide uppercase">Esperando texto...</p>
            </div>`;
    },

    renderMatches(matches, onFixClick) {
        this.elements.resultsPanel.innerHTML = '';

        if (!matches || matches.length === 0) {
            this.elements.resultsPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-emerald-600 dark:text-emerald-400 font-mono text-xs text-center p-6">
                    <span class="material-symbols-outlined text-4xl mb-2">check_circle</span>
                    <p class="font-semibold uppercase tracking-wider">¡Texto impecable!</p>
                </div>`;
            return;
        }

        matches.forEach((match, idx) => {
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-zinc-900 p-4 rounded border border-zinc-200 dark:border-zinc-800 shadow-sm mb-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all font-mono text-xs';

            const contextText = match.context.text;
            const errorOffsetInContext = match.context.offset;
            const errorLength = match.context.length;
            
            const pre = contextText.substring(0, errorOffsetInContext);
            const err = contextText.substring(errorOffsetInContext, errorOffsetInContext + errorLength);
            const post = contextText.substring(errorOffsetInContext + errorLength);

            const highlightedContext = `...${pre}<span class="bg-red-500/10 text-red-600 dark:text-red-400 font-semibold px-1 rounded underline decoration-wavy underline-offset-2">${err}</span>${post}...`;

            let buttons = match.replacements.slice(0, 3).map(rep =>
                `<button class="fix-btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80 text-xs px-2.5 py-1 rounded font-mono transition-colors border border-indigo-200 dark:border-indigo-800/60" 
                    data-index="${idx}" 
                    data-rep="${rep.value}">
                    ${rep.value}
                 </button>`
            ).join('');

            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[11px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">error_outline</span> CORRECCIÓN
                    </span>
                </div>
                <div class="text-xs text-zinc-700 dark:text-zinc-300 mb-2 font-mono leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded border border-zinc-100 dark:border-zinc-800/80">
                    "${highlightedContext}"
                </div>
                <div class="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">${match.message}</div>
                <div class="flex flex-wrap gap-1.5">${buttons}</div>
            `;
            this.elements.resultsPanel.appendChild(card);
        });

        document.querySelectorAll('.fix-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const replacement = e.target.dataset.rep;
                onFixClick(index, replacement);
            });
        });
    }
};