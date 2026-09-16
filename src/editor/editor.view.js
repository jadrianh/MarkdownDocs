import { EditorService } from './editor.service.js';
import { state } from '../core/state.js';

export const EditorView = {
    // Antes estos elementos se capturaban al importar el módulo (top-level),
    // lo que obligaba a tener el DOM ya montado en ese instante exacto y
    // complicaba re-montar un DOM distinto entre tests. Ahora se capturan
    // explícitamente con init(), llamado una vez desde main.js tras
    // DOMContentLoaded.
    elements: {},

    init() {
        this.elements = {
            editor: document.getElementById('editor'),
            editorPaneContainer: document.getElementById('editorPaneContainer'),
            previewPaneContainer: document.getElementById('previewPaneContainer'),
            splitDivider: document.getElementById('splitDivider'),
            previewSplitHeader: document.getElementById('previewSplitHeader'),
            workspacePanes: document.getElementById('workspacePanes'),
            wordCount: document.getElementById('wordCount'),
            charCount: document.getElementById('charCount'),
            previewPanel: document.getElementById('previewPanel'),
            toggleViewBtn: document.getElementById('toggleViewBtn'),
            toggleViewIcon: document.getElementById('toggleViewIcon'),
            toggleSplitBtn: document.getElementById('toggleSplitBtn'),
            toggleSplitIcon: document.getElementById('toggleSplitIcon'),
            saveStatusContainer: document.getElementById('saveStatusContainer'),
            saveStatusIcon: document.getElementById('saveStatusIcon')
        };
        this.applyViewModeUI(state.viewMode);
    },

    setSaveStatus(status, meta = {}) {
        const { saveStatusContainer, saveStatusIcon } = this.elements;
        if (!saveStatusContainer || !saveStatusIcon) return;

        saveStatusIcon.classList.remove('animate-spin', 'text-amber-500', 'text-emerald-500', 'text-zinc-400', 'text-red-500', 'dark:text-zinc-500');

        switch (status) {
            case 'saving':
                saveStatusIcon.textContent = 'sync';
                saveStatusIcon.classList.add('animate-spin', 'text-amber-500');
                saveStatusContainer.title = 'Guardando cambios...';
                break;
            case 'saved':
                saveStatusIcon.textContent = 'cloud_done';
                saveStatusIcon.classList.add('text-emerald-500');
                saveStatusContainer.title = meta.time ? `Guardado (${meta.time})` : 'Guardado localmente';
                break;
            case 'error':
                saveStatusIcon.textContent = 'cloud_off';
                saveStatusIcon.classList.add('text-red-500');
                saveStatusContainer.title = 'Error al guardar en el navegador';
                break;
            case 'idle':
            default:
                saveStatusIcon.textContent = 'cloud';
                saveStatusIcon.classList.add('text-zinc-400', 'dark:text-zinc-500');
                saveStatusContainer.title = 'Borrador guardado localmente';
                break;
        }
    },

    _counterRafId: null,
    _previewTimer: null,

    countWords(str) {
        if (!str) return 0;
        let count = 0;
        let inWord = false;
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            if (code <= 32) {
                inWord = false;
            } else if (!inWord) {
                inWord = true;
                count++;
            }
        }
        return count;
    },

    updateCounters() {
        if (this._counterRafId) return;
        this._counterRafId = requestAnimationFrame(() => {
            this._counterRafId = null;
            if (!this.elements.editor) return;
            const text = this.elements.editor.value;
            const words = this.countWords(text);
            if (this.elements.wordCount) this.elements.wordCount.textContent = `${words} PALABRAS`;
            if (this.elements.charCount) this.elements.charCount.textContent = `${text.length} CARACTERES`;
        });
    },

    updatePreview(immediate = false) {
        if (immediate) {
            this._renderPreview();
            return;
        }
        if (this._previewTimer) clearTimeout(this._previewTimer);
        this._previewTimer = setTimeout(() => {
            this._renderPreview();
        }, 80);
    },

    _renderPreview() {
        try {
            this.elements.previewPanel.innerHTML = EditorService.parseMarkdown(this.elements.editor.value);
        } catch (err) {
            console.error("Error al actualizar la vista previa:", err);
            this.elements.previewPanel.innerHTML = `
                <div class="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-700 dark:text-red-300 font-sans text-xs flex items-center gap-3">
                    <span class="material-symbols-outlined text-[24px] text-red-500">warning</span>
                    <div>
                        <p class="font-semibold">Error al renderizar el documento</p>
                        <p class="opacity-80">Revisa la sintaxis o formato del texto.</p>
                    </div>
                </div>
            `;
        }
    },

    setViewMode(mode) {
        state.setViewMode(mode);
        this.applyViewModeUI(mode);
    },

    applyViewModeUI(mode) {
        const {
            editorPaneContainer,
            previewPaneContainer,
            splitDivider,
            previewSplitHeader,
            previewPanel,
            editor,
            workspacePanes,
            toggleViewBtn,
            toggleViewIcon,
            toggleSplitBtn,
            toggleSplitIcon
        } = this.elements;

        if (workspacePanes) {
            workspacePanes.dataset.viewMode = mode;
        }

        if (mode === 'split') {
            if (editorPaneContainer) {
                editorPaneContainer.classList.remove('hidden', 'w-full');
                editorPaneContainer.classList.add('w-1/2', 'flex-1');
            }
            if (editor) editor.classList.remove('hidden');
            if (splitDivider) splitDivider.classList.remove('hidden');
            if (previewPaneContainer) {
                previewPaneContainer.classList.remove('hidden', 'w-full');
                previewPaneContainer.classList.add('w-1/2', 'flex-1');
            }
            if (previewPanel) previewPanel.classList.remove('hidden');
            if (previewSplitHeader) {
                previewSplitHeader.classList.remove('hidden');
                previewSplitHeader.classList.add('flex');
            }

            // Segundo botón (toggleSplitBtn): Activo similar a toggleSidebarBtn
            if (toggleSplitBtn) {
                toggleSplitBtn.setAttribute('aria-pressed', 'true');
                toggleSplitBtn.classList.add('text-primary');
                toggleSplitBtn.title = 'Desactivar vista dividida (Ctrl+Alt+S)';
            }
            if (toggleSplitIcon) {
                toggleSplitIcon.classList.add('text-primary');
            }

            // Primer botón (toggleViewBtn): Se bloquea en modo edición/editor
            if (toggleViewBtn) {
                toggleViewBtn.disabled = true;
                toggleViewBtn.setAttribute('aria-disabled', 'true');
                toggleViewBtn.classList.remove('text-primary');
                toggleViewBtn.title = 'Modo edición (Bloqueado en vista dividida)';
            }
            if (toggleViewIcon) {
                toggleViewIcon.textContent = 'edit_note';
                toggleViewIcon.classList.remove('text-primary');
            }

            this.updatePreview(true);
        } else if (mode === 'preview') {
            if (editorPaneContainer) editorPaneContainer.classList.add('hidden');
            if (editor) editor.classList.add('hidden');
            if (splitDivider) splitDivider.classList.add('hidden');
            if (previewPaneContainer) {
                previewPaneContainer.classList.remove('hidden', 'w-1/2');
                previewPaneContainer.classList.add('w-full', 'flex-1');
            }
            if (previewPanel) previewPanel.classList.remove('hidden');
            if (previewSplitHeader) previewSplitHeader.classList.add('hidden');

            // Segundo botón (toggleSplitBtn): Inactivo
            if (toggleSplitBtn) {
                toggleSplitBtn.setAttribute('aria-pressed', 'false');
                toggleSplitBtn.classList.remove('text-primary');
                toggleSplitBtn.title = 'Activar vista dividida (Ctrl+Alt+S)';
            }
            if (toggleSplitIcon) {
                toggleSplitIcon.classList.remove('text-primary');
            }

            // Primer botón (toggleViewBtn): Desbloqueado, muestra que regresa al editor
            if (toggleViewBtn) {
                toggleViewBtn.disabled = false;
                toggleViewBtn.removeAttribute('aria-disabled');
                toggleViewBtn.classList.add('text-primary');
                toggleViewBtn.title = 'Ver editor (Ctrl+Alt+P)';
            }
            if (toggleViewIcon) {
                toggleViewIcon.textContent = 'edit_note';
                toggleViewIcon.classList.add('text-primary');
            }

            this.updatePreview(true);
        } else {
            // mode === 'editor'
            if (editorPaneContainer) {
                editorPaneContainer.classList.remove('hidden', 'w-1/2');
                editorPaneContainer.classList.add('w-full', 'flex-1');
            }
            if (editor) editor.classList.remove('hidden');
            if (splitDivider) splitDivider.classList.add('hidden');
            if (previewPaneContainer) previewPaneContainer.classList.add('hidden');
            if (previewPanel) previewPanel.classList.add('hidden');
            if (previewSplitHeader) previewSplitHeader.classList.add('hidden');

            // Segundo botón (toggleSplitBtn): Inactivo
            if (toggleSplitBtn) {
                toggleSplitBtn.setAttribute('aria-pressed', 'false');
                toggleSplitBtn.classList.remove('text-primary');
                toggleSplitBtn.title = 'Activar vista dividida (Ctrl+Alt+S)';
            }
            if (toggleSplitIcon) {
                toggleSplitIcon.classList.remove('text-primary');
            }

            // Primer botón (toggleViewBtn): Desbloqueado, muestra opción para ver previa
            if (toggleViewBtn) {
                toggleViewBtn.disabled = false;
                toggleViewBtn.removeAttribute('aria-disabled');
                toggleViewBtn.classList.remove('text-primary');
                toggleViewBtn.title = 'Ver vista previa (Ctrl+Alt+P)';
            }
            if (toggleViewIcon) {
                toggleViewIcon.textContent = 'chrome_reader_mode';
                toggleViewIcon.classList.remove('text-primary');
            }

            editor?.focus();
        }
    },

    toggleViewMode() {
        if (state.viewMode === 'split') {
            return;
        }
        if (state.viewMode === 'preview') {
            this.setViewMode('editor');
        } else {
            this.setViewMode('preview');
        }
    },

    toggleSplitMode() {
        if (state.viewMode === 'split') {
            this.setViewMode('editor');
        } else {
            this.setViewMode('split');
        }
    }
};