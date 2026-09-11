import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService, DRAFT_STORAGE_KEY } from './storage.service.js';

describe('StorageService (Auto-Save Resilience)', () => {
    beforeEach(() => {
        StorageService.clearDraft();
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
        }
    });

    it('saves and loads a valid draft', () => {
        const markdown = '# Documento Importante\n\nEste texto no se debe perder.';
        const saved = StorageService.saveDraft(markdown);

        expect(saved).not.toBeNull();
        expect(saved.content).toBe(markdown);
        expect(saved.version).toBe(1);
        expect(typeof saved.updatedAt).toBe('number');

        const loaded = StorageService.loadDraft();
        expect(loaded).not.toBeNull();
        expect(loaded.content).toBe(markdown);
        expect(loaded.updatedAt).toBe(saved.updatedAt);
        expect(StorageService.hasDraft()).toBe(true);
    });

    it('clears draft when saving empty string or whitespace only', () => {
        StorageService.saveDraft('# Contenido inicial');
        expect(StorageService.hasDraft()).toBe(true);

        const result = StorageService.saveDraft('    \n\n  ');
        expect(result.isEmpty).toBe(true);
        expect(StorageService.hasDraft()).toBe(false);
        expect(StorageService.loadDraft()).toBeNull();
    });

    it('handles null or undefined input gracefully', () => {
        expect(StorageService.saveDraft(null)).toBeNull();
        expect(StorageService.saveDraft(undefined)).toBeNull();
    });

    it('explicit clearDraft removes item from storage', () => {
        StorageService.saveDraft('Nota de prueba');
        expect(StorageService.hasDraft()).toBe(true);

        StorageService.clearDraft();
        expect(StorageService.hasDraft()).toBe(false);
        expect(StorageService.loadDraft()).toBeNull();
    });

    it('recovers gracefully from corrupted JSON in localStorage', () => {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(DRAFT_STORAGE_KEY, '{ json_invalido: ');
            expect(StorageService.loadDraft()).toBeNull();
            expect(StorageService.hasDraft()).toBe(false);
        }
    });

    it('formats timestamp into localized time string', () => {
        const now = 1726073100000;
        const formatted = StorageService.formatTime(now);
        expect(typeof formatted).toBe('string');
        expect(formatted.length).toBeGreaterThan(0);
        expect(StorageService.formatTime(null)).toBe('');
    });

    it('falls back safely to memory when localStorage throws error', () => {
        const isStorageAvailableSpy = vi.spyOn(StorageService, 'isStorageAvailable').mockReturnValue(false);
        
        const fallbackText = 'Guardado en memoria de contingencia';
        StorageService.saveDraft(fallbackText);
        
        const loaded = StorageService.loadDraft();
        expect(loaded).not.toBeNull();
        expect(loaded.content).toBe(fallbackText);

        StorageService.clearDraft();
        expect(StorageService.loadDraft()).toBeNull();

        isStorageAvailableSpy.mockRestore();
    });
});
