import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LanguageToolAPI } from './languageTool.Client.js';

describe('LanguageToolAPI Client', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns empty matches array immediately if text is empty or whitespace', async () => {
        const result1 = await LanguageToolAPI.check('', 'es');
        const result2 = await LanguageToolAPI.check('   \n  ', 'es');

        expect(result1).toEqual({ matches: [] });
        expect(result2).toEqual({ matches: [] });
    });

    it('sends correct request and returns parsed matches on success', async () => {
        const mockResponse = {
            matches: [
                { message: 'Posible falta ortográfica', offset: 0, length: 4 }
            ]
        };

        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse
        });

        const result = await LanguageToolAPI.check('Hlaa mundo', 'es');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.matches).toHaveLength(1);
        expect(result.matches[0].offset).toBe(0);
    });

    it('throws descriptive error on HTTP failure status', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 503
        });

        await expect(LanguageToolAPI.check('texto de prueba', 'es')).rejects.toThrow('Error en la red: 503');
    });

    it('handles timeout abort with custom error message', async () => {
        const abortError = new Error('The operation was aborted');
        abortError.name = 'AbortError';

        globalThis.fetch = vi.fn().mockRejectedValue(abortError);

        await expect(LanguageToolAPI.check('texto de prueba', 'es')).rejects.toThrow(
            'Tiempo de espera agotado al conectar con LanguageTool'
        );
    });
});
