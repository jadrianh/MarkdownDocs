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
        this.isPreviewMode = false;
        this.isTyping = false;
        this.currentMatches = [];
        this.currentLanguage = getStoredLanguage();
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        setStoredLanguage(lang);
    }

    setPreviewMode(isPreview) {
        this.isPreviewMode = isPreview;
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
}

export const state = new AppState();