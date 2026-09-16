import { HistoryManager } from '../editor/history.js';

const getStoredLanguage = () => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem('editorLanguage') || 'es';
        }
    } catch {
        // Safe fallback for test/node environments
    }
    return 'es';
};

const setStoredLanguage = (lang) => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem('editorLanguage', lang);
        }
    } catch {
        // Safe fallback for test/node environments
    }
};

export class AppState {
    constructor() {
        this.history = new HistoryManager();
        this.viewMode = 'editor'; // 'editor' | 'split' | 'preview'
        this.isPreviewMode = false;
        this.isTyping = false;
        this.currentMatches = [];
        this.currentLanguage = getStoredLanguage();
        this.isSidebarOpen = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
    }

    setViewMode(mode) {
        if (mode !== 'editor' && mode !== 'split' && mode !== 'preview') return;
        this.viewMode = mode;
        this.isPreviewMode = (mode === 'preview');
    }

    get isPreviewVisible() {
        return this.viewMode === 'split' || this.viewMode === 'preview';
    }

    get isEditorVisible() {
        return this.viewMode === 'editor' || this.viewMode === 'split';
    }

    setSidebarOpen(isOpen) {
        this.isSidebarOpen = isOpen;
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        setStoredLanguage(lang);
    }

    setPreviewMode(isPreview) {
        this.isPreviewMode = isPreview;
        this.viewMode = isPreview ? 'preview' : 'editor';
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
    }

    setMatches(matches) {
        this.currentMatches = matches;
    }

    removeMatch(index) {
        this.currentMatches.splice(index, 1);
    }

    /**
     * Ajusta los offsets de las coincidencias restantes tras aplicar una
     * corrección que cambió la longitud del texto. Antes grammar.controller.js
     * mutaba `state.currentMatches[i].offset` directamente desde afuera;
     * centralizarlo aquí mantiene el estado encapsulado en un solo lugar.
     */
    shiftOffsetsAfter(offset, lengthDiff) {
        this.currentMatches.forEach((match) => {
            if (match.offset > offset) {
                match.offset += lengthDiff;
            }
        });
    }
}

export const state = new AppState();