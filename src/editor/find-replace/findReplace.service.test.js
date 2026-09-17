import { describe, it, expect } from 'vitest';
import {
    escapeRegex,
    findMatches,
    replaceCurrent,
    replaceAll,
    getNextIndex,
    getPrevIndex
} from './findReplace.service.js';

describe('Find & Replace Service', () => {
    describe('escapeRegex', () => {
        it('escapes all regular expression special characters', () => {
            expect(escapeRegex('hello.world[1] (test)? * + $ ^ { } | \\')).toBe(
                'hello\\.world\\[1\\] \\(test\\)\\? \\* \\+ \\$ \\^ \\{ \\} \\| \\\\'
            );
        });

        it('handles empty input gracefully', () => {
            expect(escapeRegex('')).toBe('');
            expect(escapeRegex(null)).toBe('');
        });
    });

    describe('findMatches', () => {
        it('returns empty array when text or query is empty', () => {
            expect(findMatches('', 'test')).toEqual([]);
            expect(findMatches('algun texto', '')).toEqual([]);
            expect(findMatches(null, 'test')).toEqual([]);
        });

        it('finds multiple matches case-insensitively by default', () => {
            const doc = 'El Markdown es genial. markdown permite escribir rápido. ¡MARKDOWN!';
            const matches = findMatches(doc, 'markdown');

            expect(matches).toHaveLength(3);
            expect(matches[0].start).toBe(3);
            expect(matches[0].matchText).toBe('Markdown');
            expect(matches[1].start).toBe(23);
            expect(matches[1].matchText).toBe('markdown');
            expect(matches[2].start).toBe(58);
            expect(matches[2].matchText).toBe('MARKDOWN');
        });

        it('respects matchCase option when true', () => {
            const doc = 'Texto con Javascript, javascript y JAVASCRIPT';
            const matches = findMatches(doc, 'javascript', { matchCase: true });

            expect(matches).toHaveLength(1);
            expect(matches[0].start).toBe(22);
            expect(matches[0].matchText).toBe('javascript');
        });

        it('searches correctly when query includes regex characters', () => {
            const doc = 'Precio: $100.00 USD, otro $100.00 USD';
            const matches = findMatches(doc, '$100.00');

            expect(matches).toHaveLength(2);
            expect(matches[0].matchText).toBe('$100.00');
            expect(matches[1].matchText).toBe('$100.00');
        });
    });

    describe('replaceCurrent', () => {
        it('replaces targeted slice and returns new string and next cursor position', () => {
            const doc = 'Hola mundo, adios mundo';
            const match = { start: 5, end: 10, matchText: 'mundo' };
            const result = replaceCurrent(doc, match, 'amigo');

            expect(result.newText).toBe('Hola amigo, adios mundo');
            expect(result.nextCursor).toBe(10);
        });

        it('supports empty string replacement (deletion)', () => {
            const doc = 'Hola [BORRAR] Mundo';
            const match = { start: 5, end: 14, matchText: '[BORRAR] ' };
            const result = replaceCurrent(doc, match, '');

            expect(result.newText).toBe('Hola Mundo');
            expect(result.nextCursor).toBe(5);
        });
    });

    describe('replaceAll', () => {
        it('replaces all occurrences and counts replacements accurately', () => {
            const doc = 'gato, perro, GATO, raton, GaTo';
            const result = replaceAll(doc, 'gato', 'felino');

            expect(result.count).toBe(3);
            expect(result.newText).toBe('felino, perro, felino, raton, felino');
        });

        it('replaces all with case sensitivity when enabled', () => {
            const doc = 'sol SOL Sol sol';
            const result = replaceAll(doc, 'sol', 'luna', { matchCase: true });

            expect(result.count).toBe(2);
            expect(result.newText).toBe('luna SOL Sol luna');
        });

        it('does not treat $ in replacement string as regex substitution tokens', () => {
            const doc = 'total: X, balance: X';
            const result = replaceAll(doc, 'X', '$100');

            expect(result.count).toBe(2);
            expect(result.newText).toBe('total: $100, balance: $100');
        });
    });

    describe('navigation index helpers', () => {
        it('cycles forward with getNextIndex', () => {
            expect(getNextIndex(0, 3)).toBe(1);
            expect(getNextIndex(1, 3)).toBe(2);
            expect(getNextIndex(2, 3)).toBe(0); // circular wrap
            expect(getNextIndex(0, 0)).toBe(-1);
        });

        it('cycles backward with getPrevIndex', () => {
            expect(getPrevIndex(2, 3)).toBe(1);
            expect(getPrevIndex(1, 3)).toBe(0);
            expect(getPrevIndex(0, 3)).toBe(2); // circular wrap
            expect(getPrevIndex(0, 0)).toBe(-1);
        });
    });
});
