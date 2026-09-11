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
            wordCount: document.getElementById('wordCount'),
            charCount: document.getElementById('charCount'),
            previewPanel: document.getElementById('previewPanel'),
            toggleViewBtn: document.getElementById('toggleViewBtn'),
            toggleViewIcon: document.getElementById('toggleViewIcon'),
            saveStatusContainer: document.getElementById('saveStatusContainer'),
            saveStatusIcon: document.getElementById('saveStatusIcon')
        };
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

    toggleViewMode() {
        const isPreviewMode = !state.isPreviewMode;
        state.setPreviewMode(isPreviewMode);

        if (isPreviewMode) {
            // Mostrar preview, ocultar editor
            this.elements.editor.classList.add('hidden');
            this.elements.previewPanel.classList.remove('hidden');
            this.elements.toggleViewBtn?.classList.add('text-primary', 'bg-primary/10');
            this.elements.toggleViewIcon.textContent = 'border_color';
            this.elements.toggleViewIcon.title = 'Volver al editor';
            this.updatePreview(true);
        } else {
            // Mostrar editor, ocultar preview
            this.elements.editor.classList.remove('hidden');
            this.elements.previewPanel.classList.add('hidden');
            this.elements.toggleViewBtn?.classList.remove('text-primary', 'bg-primary/10');
            this.elements.toggleViewIcon.textContent = 'chrome_reader_mode';
            this.elements.toggleViewIcon.title = 'Ver vista previa';
        }
    }
};