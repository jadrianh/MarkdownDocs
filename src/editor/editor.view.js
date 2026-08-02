import { EditorService } from './editor.service.js';
import { state } from '../core/state.js';

export const EditorView = {
    elements: {
        editor: document.getElementById('editor'),
        wordCount: document.getElementById('wordCount'),
        charCount: document.getElementById('charCount'),
        previewPanel: document.getElementById('previewPanel'),
        resultsPanel: document.getElementById('resultsPanel'),
        panelTitle: document.getElementById('panelTitle'),
        toggleViewText: document.getElementById('toggleViewText'),
        toggleViewIcon: document.getElementById('toggleViewIcon')
    },

    updateCounters() {
        const text = this.elements.editor.value;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        this.elements.wordCount.textContent = `${words} PALABRAS`;
        this.elements.charCount.textContent = `${text.length} CARACTERES`;
    },

    updatePreview() {
        this.elements.previewPanel.innerHTML = EditorService.parseMarkdown(this.elements.editor.value);
    },

    toggleViewMode() {
        const isPreviewMode = !state.isPreviewMode;
        state.setPreviewMode(isPreviewMode);

        if (isPreviewMode) {
            this.elements.resultsPanel.classList.add('hidden');
            this.elements.previewPanel.classList.remove('hidden');
            this.elements.panelTitle.innerHTML = '<span class="material-symbols-outlined text-primary text-[24px]">visibility</span> VISTA PREVIA';
            this.elements.toggleViewText.textContent = "CORRECTOR";
            this.elements.toggleViewIcon.textContent = "auto_awesome"; 
            this.updatePreview();
        } else {
            this.elements.resultsPanel.classList.remove('hidden');
            this.elements.previewPanel.classList.add('hidden');
            this.elements.panelTitle.innerHTML = '<span class="material-symbols-outlined text-primary text-[24px]">auto_awesome</span> SUGERENCIAS';
            this.elements.toggleViewText.textContent = "VISTA PREVIA";
            this.elements.toggleViewIcon.textContent = "text_snippet"; 
        }
    }
};