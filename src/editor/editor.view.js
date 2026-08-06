import { EditorService } from './editor.service.js';
import { state } from '../core/state.js';

export const EditorView = {
    elements: {
        editor: document.getElementById('editor'),
        wordCount: document.getElementById('wordCount'),
        charCount: document.getElementById('charCount'),
        previewPanel: document.getElementById('previewPanel'),
        toggleViewIcon: document.getElementById('toggleViewIcon')
    },

    updateCounters() {
        const text = this.elements.editor.value;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        this.elements.wordCount.textContent = `${words} PALABRAS`;
        this.elements.charCount.textContent = `${text.length} CARACTERES`;
    },

    updatePreview() {
        try {
            this.elements.previewPanel.innerHTML = EditorService.parseMarkdown(this.elements.editor.value);
        } catch (err) {
            console.error("Error al actualizar la vista previa:", err);
            this.elements.previewPanel.innerHTML = `
                <div class="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-700 dark:text-red-300 font-sans text-xs flex items-center gap-3">
                    <span class="material-symbols-outlined text-[20px] text-red-500">warning</span>
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
            this.elements.toggleViewIcon.textContent = 'border_color';
            this.elements.toggleViewIcon.title = 'Volver al editor';
            this.updatePreview();
        } else {
            // Mostrar editor, ocultar preview
            this.elements.editor.classList.remove('hidden');
            this.elements.previewPanel.classList.add('hidden');
            this.elements.toggleViewIcon.textContent = 'chrome_reader_mode';
            this.elements.toggleViewIcon.title = 'Ver vista previa';
        }
    }
};