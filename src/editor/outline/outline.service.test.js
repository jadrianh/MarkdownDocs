import { describe, it, expect, vi } from 'vitest';
import {
    extractHeadings,
    cleanInlineMarkdown,
    generateSlug,
    navigateToHeadingInEditor,
    navigateToHeadingInPreview
} from './outline.service.js';

describe('Outline Service (Estructura de Documentos)', () => {
    describe('cleanInlineMarkdown', () => {
        it('removes links, bold, italics, code, and math formatting', () => {
            expect(cleanInlineMarkdown('**Negrita** y *Cursiva*')).toBe('Negrita y Cursiva');
            expect(cleanInlineMarkdown('[Guía](https://example.com)')).toBe('Guía');
            expect(cleanInlineMarkdown('`código inline` y $E=mc^2$')).toBe('código inline y E=mc^2');
            expect(cleanInlineMarkdown('~~tachado~~')).toBe('tachado');
            expect(cleanInlineMarkdown('Texto sin formato')).toBe('Texto sin formato');
            expect(cleanInlineMarkdown('')).toBe('');
        });
    });

    describe('generateSlug', () => {
        it('generates clean URL-safe slugs with diacritics removed', () => {
            const counts = new Map();
            expect(generateSlug('Introducción a la Programación', counts)).toBe('introduccion-a-la-programacion');
            expect(generateSlug('¡Atención! ¿Qué es esto?', counts)).toBe('atencion-que-es-esto');
        });

        it('handles collisions by appending incremental counters', () => {
            const counts = new Map();
            expect(generateSlug('Sección', counts)).toBe('seccion');
            expect(generateSlug('Sección', counts)).toBe('seccion-1');
            expect(generateSlug('Sección', counts)).toBe('seccion-2');
        });

        it('falls back to index if slug is empty', () => {
            const counts = new Map();
            expect(generateSlug('???', counts, 0)).toBe('seccion-1');
        });
    });

    describe('extractHeadings', () => {
        it('returns empty array for empty or non-string input', () => {
            expect(extractHeadings('')).toEqual([]);
            expect(extractHeadings(null)).toEqual([]);
            expect(extractHeadings(undefined)).toEqual([]);
        });

        it('extracts all ATX heading levels (H1 to H6)', () => {
            const doc = [
                '# Nivel 1',
                'Párrafo',
                '## Nivel 2',
                '### Nivel 3',
                '#### Nivel 4',
                '##### Nivel 5',
                '###### Nivel 6'
            ].join('\n');

            const headings = extractHeadings(doc);
            expect(headings).toHaveLength(6);
            expect(headings[0].level).toBe(1);
            expect(headings[0].text).toBe('Nivel 1');
            expect(headings[0].line).toBe(0);

            expect(headings[1].level).toBe(2);
            expect(headings[1].text).toBe('Nivel 2');
            expect(headings[1].line).toBe(2);

            expect(headings[5].level).toBe(6);
            expect(headings[5].text).toBe('Nivel 6');
        });

        it('ignores headings inside fenced code blocks (``` and ~~~)', () => {
            const doc = [
                '# Título Real',
                '```javascript',
                '# Esto es un comentario en Python o bash, no un heading',
                '## Tampoco este',
                '```',
                '## Sección Valida',
                '~~~',
                '### Otro bloque',
                '~~~',
                '### Subsección Final'
            ].join('\n');

            const headings = extractHeadings(doc);
            expect(headings).toHaveLength(3);
            expect(headings.map(h => h.text)).toEqual([
                'Título Real',
                'Sección Valida',
                'Subsección Final'
            ]);
        });

        it('ignores headings inside math display blocks ($$)', () => {
            const doc = [
                '# Encabezado 1',
                '$$',
                '# Not a heading',
                '$$',
                '## Encabezado 2'
            ].join('\n');

            const headings = extractHeadings(doc);
            expect(headings).toHaveLength(2);
            expect(headings[0].text).toBe('Encabezado 1');
            expect(headings[1].text).toBe('Encabezado 2');
        });

        it('cleans trailing hashes from headings', () => {
            const doc = '## Título Cerrado ##';
            const headings = extractHeadings(doc);
            expect(headings).toHaveLength(1);
            expect(headings[0].text).toBe('Título Cerrado');
        });

        it('cleans markdown symbols from heading text for clean outline display', () => {
            const doc = '### Guía de **TypeScript** y `Node.js`';
            const headings = extractHeadings(doc);
            expect(headings).toHaveLength(1);
            expect(headings[0].text).toBe('Guía de TypeScript y Node.js');
        });
    });

    describe('navigateToHeadingInEditor', () => {
        it('sets selection and adjusts scrollTop', () => {
            const editor = {
                value: '# Uno\nTexto\n## Dos\nMás texto',
                scrollHeight: 800,
                scrollTop: 0,
                focus: vi.fn(),
                setSelectionRange: vi.fn()
            };

            const heading = { charOffset: 12, line: 2 };
            navigateToHeadingInEditor(editor, heading);

            expect(editor.focus).toHaveBeenCalled();
            expect(editor.setSelectionRange).toHaveBeenCalledWith(12, 12);
            expect(editor.scrollTop).toBeGreaterThanOrEqual(0);
        });
    });

    describe('navigateToHeadingInPreview', () => {
        it('scrolls preview element into view and adds temporary highlight', () => {
            const mockEl = {
                scrollIntoView: vi.fn(),
                classList: {
                    add: vi.fn(),
                    remove: vi.fn()
                }
            };

            const previewPanel = {
                querySelector: vi.fn().mockReturnValue(mockEl),
                querySelectorAll: vi.fn().mockReturnValue([mockEl])
            };

            navigateToHeadingInPreview(previewPanel, 0, 'seccion-1');

            expect(mockEl.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
            expect(mockEl.classList.add).toHaveBeenCalledWith('outline-target-highlight');
        });
    });
});
