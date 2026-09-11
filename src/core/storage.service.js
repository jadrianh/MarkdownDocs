/**
 * Local Storage Service for MarkdownDocs
 * Provides resilient, offline-first autosaving of drafts compatible with GitHub Pages.
 * Handles localStorage quota exceptions, private mode restrictions, and data serialization.
 */

export const DRAFT_STORAGE_KEY = 'markdowndocs_draft_v1';

class StorageServiceImplementation {
    constructor() {
        this.storageKey = DRAFT_STORAGE_KEY;
        this._memoryFallback = null;
    }

    /**
     * Checks if localStorage is available in the current runtime environment
     * @returns {boolean}
     */
    isStorageAvailable() {
        try {
            if (typeof window === 'undefined' || !window.localStorage) {
                return false;
            }
            const testKey = '__storage_test__';
            window.localStorage.setItem(testKey, testKey);
            window.localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Saves draft content with timestamp and statistics
     * @param {string} content - Markdown content to save
     * @returns {Object|null} The saved draft payload or null if failed
     */
    saveDraft(content) {
        if (content === null || content === undefined) return null;

        const trimmed = content.trim();
        // Si el contenido está completamente vacío, limpiamos el borrador para no restaurar basura
        if (trimmed.length === 0) {
            this.clearDraft();
            return {
                version: 1,
                content: '',
                updatedAt: Date.now(),
                isEmpty: true
            };
        }

        const payload = {
            version: 1,
            content,
            updatedAt: Date.now()
        };

        try {
            if (this.isStorageAvailable()) {
                window.localStorage.setItem(this.storageKey, JSON.stringify(payload));
            } else {
                this._memoryFallback = payload;
            }
            return payload;
        } catch (error) {
            console.warn('StorageService: Error al guardar en localStorage (posible cuota excedida)', error);
            this._memoryFallback = payload;
            return payload;
        }
    }

    /**
     * Loads the saved draft from localStorage
     * @returns {Object|null} Parsed draft object or null if none exists or invalid
     */
    loadDraft() {
        try {
            let rawData = null;
            if (this.isStorageAvailable()) {
                rawData = window.localStorage.getItem(this.storageKey);
            } else if (this._memoryFallback) {
                return this._memoryFallback;
            }

            if (!rawData) return null;

            const parsed = JSON.parse(rawData);
            if (parsed && typeof parsed.content === 'string' && typeof parsed.updatedAt === 'number') {
                return parsed;
            }
            return null;
        } catch (error) {
            console.warn('StorageService: Error al leer el borrador de localStorage', error);
            return null;
        }
    }

    /**
     * Removes the draft from localStorage
     */
    clearDraft() {
        try {
            if (this.isStorageAvailable()) {
                window.localStorage.removeItem(this.storageKey);
            }
            this._memoryFallback = null;
        } catch (error) {
            console.warn('StorageService: Error al eliminar borrador', error);
        }
    }

    /**
     * Checks if a valid non-empty draft exists
     * @returns {boolean}
     */
    hasDraft() {
        const draft = this.loadDraft();
        return Boolean(draft && draft.content && draft.content.trim().length > 0);
    }

    /**
     * Formats a timestamp into a human-readable local time string (e.g. "11:45:02" or "11:45")
     * @param {number} timestamp
     * @returns {string}
     */
    formatTime(timestamp) {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return '';
        }
    }
}

export const StorageService = new StorageServiceImplementation();
