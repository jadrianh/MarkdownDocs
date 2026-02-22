import { HistoryManager } from '../editor/history.js';

class AppState {
    constructor() {
        this.history = new HistoryManager();
        this.isPreviewMode = false;
        this.isTyping = false;
        this.currentMatches = [];
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