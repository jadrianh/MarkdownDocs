import { PREFERENCES_PAGES } from './pages/registry.js';

/**
 * Preferences Modal View Module
 * Encapsulates DOM queries, left-sidebar tab routing, live preview syncing, and open/close transitions.
 */
export const PreferencesModalView = {
    elements: {},
    activePageId: 'appearance',

    init() {
        this.elements = {
            modal: document.getElementById('themeModal'),
            backdrop: document.getElementById('themeModalBackdrop'),
            content: document.getElementById('themeModalContent'),
            closeBtn: document.getElementById('closeThemeModal'),
            pageLabel: document.getElementById('preferencesCurrentPageLabel'),
            sidebar: document.getElementById('preferencesSidebar'),
            editorFontSelect: document.getElementById('editorFontFamily'),
            editorFontSizeRange: document.getElementById('editorFontSize'),
            editorFontSample: document.getElementById('editorFontSample'),
            previewFontSelect: document.getElementById('previewFontFamily'),
            previewFontSizeRange: document.getElementById('previewFontSize'),
            previewFontSample: document.getElementById('previewFontSample')
        };

        this._setupTabListeners();
        this._setupLiveFontPreviewListeners();
        this.syncFontSamples();
    },

    /**
     * Attaches click and keyboard arrow navigation to sidebar tab buttons
     */
    _setupTabListeners() {
        const { sidebar } = this.elements;
        if (!sidebar) return;

        const tabs = Array.from(sidebar.querySelectorAll('.pref-nav-btn'));

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                const pageId = tab.dataset.pageId;
                if (pageId) {
                    this.setActivePage(pageId);
                }
            });

            tab.addEventListener('keydown', (e) => {
                let targetIndex = null;

                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    targetIndex = (index + 1) % tabs.length;
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    targetIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    targetIndex = 0;
                } else if (e.key === 'End') {
                    e.preventDefault();
                    targetIndex = tabs.length - 1;
                }

                if (targetIndex !== null) {
                    const targetTab = tabs[targetIndex];
                    targetTab.focus();
                    const pageId = targetTab.dataset.pageId;
                    if (pageId) {
                        this.setActivePage(pageId);
                    }
                }
            });
        });
    },

    /**
     * Binds real-time sample typography updates in the modal
     */
    _setupLiveFontPreviewListeners() {
        const {
            editorFontSelect,
            editorFontSizeRange,
            previewFontSelect,
            previewFontSizeRange
        } = this.elements;

        editorFontSelect?.addEventListener('change', () => this.syncFontSamples());
        editorFontSizeRange?.addEventListener('input', () => this.syncFontSamples());
        previewFontSelect?.addEventListener('change', () => this.syncFontSamples());
        previewFontSizeRange?.addEventListener('input', () => this.syncFontSamples());
    },

    /**
     * Switches the active page panel and updates sidebar tab states
     *
     * @param {string} pageId - Target page identifier
     */
    setActivePage(pageId) {
        const pageDef = PREFERENCES_PAGES.find(p => p.id === pageId);
        if (!pageDef) return;

        this.activePageId = pageId;

        // 1. Update tab navigation states
        const tabBtns = document.querySelectorAll('.pref-nav-btn');
        tabBtns.forEach((btn) => {
            const isMatch = btn.dataset.pageId === pageId;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');

            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon) {
                if (isMatch) {
                    icon.classList.add('text-primary');
                    icon.classList.remove('text-zinc-400');
                } else {
                    icon.classList.remove('text-primary');
                    icon.classList.add('text-zinc-400');
                }
            }
        });

        // 2. Switch visible page panel
        const panels = document.querySelectorAll('.pref-page-panel');
        panels.forEach((panel) => {
            const isMatch = panel.id === `pref-page-${pageId}`;
            panel.classList.toggle('hidden', !isMatch);
        });

        // 3. Update header breadcrumb label
        const { pageLabel } = this.elements;
        if (pageLabel) {
            pageLabel.textContent = pageDef.label;
        }

        // 4. Sync sample font previews if switching to typography
        if (pageId === 'typography') {
            this.syncFontSamples();
        }
    },

    /**
     * Synchronizes live font sample cards in the Typography page
     */
    syncFontSamples() {
        const {
            editorFontSelect,
            editorFontSizeRange,
            editorFontSample,
            previewFontSelect,
            previewFontSizeRange,
            previewFontSample
        } = this.elements;

        if (editorFontSample && editorFontSelect && editorFontSizeRange) {
            editorFontSample.style.fontFamily = editorFontSelect.value;
            editorFontSample.style.fontSize = `${editorFontSizeRange.value}px`;
        }

        if (previewFontSample && previewFontSelect && previewFontSizeRange) {
            previewFontSample.style.fontFamily = previewFontSelect.value;
            previewFontSample.style.fontSize = `${previewFontSizeRange.value}px`;
        }
    },

    open(targetPageId) {
        const { modal, backdrop, content } = this.elements;
        if (!modal) return;

        if (targetPageId) {
            this.setActivePage(targetPageId);
        }

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            backdrop?.classList.remove('opacity-0');
            content?.classList.remove('opacity-0', 'scale-95');
        });

        this.syncFontSamples();
    },

    close() {
        const { modal, backdrop, content } = this.elements;
        if (!modal) return;

        backdrop?.classList.add('opacity-0');
        content?.classList.add('opacity-0', 'scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    },

    isOpen() {
        const { modal } = this.elements;
        return modal ? !modal.classList.contains('hidden') : false;
    }
};
