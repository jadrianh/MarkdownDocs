/**
 * Outline View
 * Gestiona el renderizado del árbol jerárquico de encabezados y el cambio de pestañas en la barra lateral.
 */

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getLevelBadgeStyle(level) {
    switch (level) {
        case 1:
            return 'bg-primary/15 text-primary dark:bg-primary/25';
        case 2:
            return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300';
        case 3:
            return 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400';
        default:
            return 'text-zinc-400 dark:text-zinc-500 font-normal';
    }
}

export const OutlineView = {
    elements: {},
    activeTab: 'suggestions',

    init() {
        this.elements = {
            outlinePanel: document.getElementById('outlinePanel'),
            outlineBadge: document.getElementById('outlineBadge'),
            suggestionsBadge: document.getElementById('suggestionsBadge'),
            resultsPanel: document.getElementById('resultsPanel'),
            sidebarTitleIcon: document.getElementById('sidebarTitleIcon'),
            sidebarTitleText: document.getElementById('sidebarTitleText'),
            switchSidebarTabBtn: document.getElementById('switchSidebarTabBtn'),
            switchSidebarTabIcon: document.getElementById('switchSidebarTabIcon'),
            toggleOutlineBtn: document.getElementById('toggleOutlineBtn'),
            toggleOutlineIcon: document.getElementById('toggleOutlineIcon')
        };
    },

    /**
     * Renderiza la lista de encabezados o el estado vacío correspondiente.
     *
     * @param {Array<{ index: number, level: number, text: string, slug: string }>} headings
     */
    render(headings) {
        const { outlinePanel, outlineBadge } = this.elements;
        if (!outlinePanel) return;

        if (!headings || headings.length === 0) {
            if (outlineBadge) {
                outlineBadge.classList.add('hidden');
                outlineBadge.textContent = '0';
            }
            outlinePanel.innerHTML = `
                <div id="outlineEmptyState" class="flex flex-col items-center justify-center text-center p-6 h-full font-mono text-xs">
                    <div class="w-12 h-12 bg-zinc-100 dark:bg-zinc-800/60 rounded-full flex items-center justify-center mb-3 text-zinc-400 dark:text-zinc-500 border border-zinc-200/60 dark:border-zinc-700/50">
                        <span class="material-symbols-outlined text-[24px]">list_arrow</span>
                    </div>
                    <p class="font-sans font-semibold text-zinc-700 dark:text-zinc-300 text-sm mb-1">Sin encabezados</p>
                    <p class="font-sans text-xs text-zinc-400 dark:text-zinc-500 max-w-[210px] leading-relaxed">
                        Agrega títulos usando <code class="bg-zinc-200/80 dark:bg-zinc-700 px-1 py-0.5 rounded text-[11px] font-mono">#</code> para estructurar tu documento de forma automática.
                    </p>
                </div>
            `;
            return;
        }

        if (outlineBadge) {
            outlineBadge.textContent = String(headings.length);
            if (this.activeTab === 'outline') {
                outlineBadge.classList.remove('hidden');
            } else {
                outlineBadge.classList.add('hidden');
            }
        }

        const itemsHtml = headings.map(h => {
            const indentRem = Math.max(0.4, (h.level - 1) * 0.75 + 0.4);
            const badgeClass = getLevelBadgeStyle(h.level);

            return /* html */ `
                <button
                    type="button"
                    class="outline-heading-item group w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-zinc-200/50 dark:hover:bg-zinc-700/60 focus:outline-none focus:bg-zinc-200/70 dark:focus:bg-zinc-700/80"
                    style="padding-left: ${indentRem}rem;"
                    data-heading-index="${h.index}"
                    data-heading-slug="${h.slug}"
                    title="Nivel ${h.level}: ${escapeHtml(h.text)}"
                >
                    <span class="text-[10px] font-mono font-bold px-1 py-0.2 rounded shrink-0 ${badgeClass}">
                        H${h.level}
                    </span>
                    <span class="truncate text-xs font-sans text-zinc-700 dark:text-zinc-300 group-hover:text-primary transition-colors">
                        ${escapeHtml(h.text)}
                    </span>
                </button>
            `;
        }).join('');

        outlinePanel.innerHTML = `
            <nav aria-label="Estructura del documento" class="space-y-0.5 py-1">
                ${itemsHtml}
            </nav>
        `;
    },

    /**
     * Alterna entre las vistas "análisis" y "estructura" en el panel lateral.
     *
     * @param {'suggestions' | 'outline'} tabName
     */
    switchTab(tabName) {
        const {
            resultsPanel,
            outlinePanel,
            sidebarTitleIcon,
            sidebarTitleText,
            switchSidebarTabBtn,
            switchSidebarTabIcon,
            suggestionsBadge,
            outlineBadge
        } = this.elements;

        this.activeTab = tabName;

        if (tabName === 'outline') {
            resultsPanel?.classList.add('hidden');
            outlinePanel?.classList.remove('hidden');

            if (sidebarTitleIcon) sidebarTitleIcon.textContent = 'list_arrow';
            if (sidebarTitleText) sidebarTitleText.textContent = 'ESTRUCTURA';

            if (switchSidebarTabIcon) switchSidebarTabIcon.textContent = 'auto_awesome';
            if (switchSidebarTabBtn) {
                switchSidebarTabBtn.setAttribute('title', 'Ver análisis');
                switchSidebarTabBtn.setAttribute('aria-label', 'Ver análisis');
            }

            suggestionsBadge?.classList.add('hidden');
            if (outlineBadge && outlineBadge.textContent !== '0' && outlineBadge.textContent.trim() !== '') {
                outlineBadge.classList.remove('hidden');
            }
        } else {
            outlinePanel?.classList.add('hidden');
            resultsPanel?.classList.remove('hidden');

            if (sidebarTitleIcon) sidebarTitleIcon.textContent = 'auto_awesome';
            if (sidebarTitleText) sidebarTitleText.textContent = 'ANÁLISIS';

            if (switchSidebarTabIcon) switchSidebarTabIcon.textContent = 'list_arrow';
            if (switchSidebarTabBtn) {
                switchSidebarTabBtn.setAttribute('title', 'Ver estructura (Ctrl+Shift+O)');
                switchSidebarTabBtn.setAttribute('aria-label', 'Ver estructura');
            }

            outlineBadge?.classList.add('hidden');
            if (suggestionsBadge && suggestionsBadge.textContent !== '0' && suggestionsBadge.textContent.trim() !== '') {
                suggestionsBadge.classList.remove('hidden');
            }
        }
    }
};
