export const GrammarView = {
    elements: {
        resultsPanel: document.getElementById('resultsPanel')
    },

    toggleLoading(isLoading) {
        if (isLoading) {
            this.elements.resultsPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-slate-400 animate-pulse">
                    <span class="material-icons-outlined text-4xl mb-2 loading-pulse">sync</span>
                    <p class="text-sm">Analizando texto...</p>
                </div>`;
        }
    },

    renderEmptyState() {
        this.elements.resultsPanel.innerHTML = `
            <div id="emptyState" class="flex flex-col items-center justify-center text-center p-6 opacity-60 h-full animate-slide-in">
                <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <span class="material-icons-outlined text-4xl text-slate-400">spellcheck</span>
                </div>
                <p class="text-sm text-slate-500">Esperando texto...</p>
            </div>`;
    },

    renderMatches(matches, onFixClick) {
        this.elements.resultsPanel.innerHTML = '';

        if (!matches || matches.length === 0) {
            this.elements.resultsPanel.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full text-emerald-500 animate-slide-in">
                    <span class="material-icons-outlined text-5xl mb-3">check_circle</span>
                    <p class="font-medium">¡Texto impecable!</p>
                </div>`;
            return;
        }

        matches.forEach((match, idx) => {
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-slate-800 p-5 rounded-lg border-l-[3px] border-red-500 shadow-sm mb-4 hover:shadow-md transition-all animate-slide-in group surface-element';
            card.style.animationDelay = `${idx * 50}ms`;

            const contextText = match.context.text;
            const errorOffsetInContext = match.context.offset;
            const errorLength = match.context.length;
            
            const pre = contextText.substring(0, errorOffsetInContext);
            const err = contextText.substring(errorOffsetInContext, errorOffsetInContext + errorLength);
            const post = contextText.substring(errorOffsetInContext + errorLength);

            const highlightedContext = `...${pre}<span class="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-semibold px-1 rounded decoration-wavy underline decoration-red-300 underline-offset-2">${err}</span>${post}...`;

            let buttons = match.replacements.slice(0, 3).map(rep =>
                `<button class="fix-btn bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 text-xs px-3 py-1.5 rounded font-medium mt-2 mr-2 transition-colors border border-indigo-200 dark:border-indigo-800" 
                    data-index="${idx}" 
                    data-rep="${rep.value}">
                    ${rep.value}
                 </button>`
            ).join('');

            card.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-red-500 uppercase tracking-wide flex items-center gap-1">
                        <span class="material-icons-outlined text-sm">error_outline</span> Corrección
                    </span>
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-300 mb-3 font-serif leading-relaxed">
                    "${highlightedContext}"
                </div>
                <div class="text-xs text-slate-400 mb-2">${match.message}</div>
                <div class="flex flex-wrap">${buttons}</div>
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