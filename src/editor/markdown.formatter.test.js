import { describe, it, expect } from 'vitest';
import { formatMarkdown } from './markdown.formatter.js';

describe('Markdown Auto-Formatter', () => {
    it('returns empty string for empty or whitespace-only input', () => {
        expect(formatMarkdown('')).toBe('');
        expect(formatMarkdown('   \n  \n  ')).toBe('');
        expect(formatMarkdown(null)).toBe('');
    });

    it('collapses multiple consecutive blank lines to at most one', () => {
        const input = 'Párrafo uno.\n\n\n\n\nPárrafo dos.';
        const expected = 'Párrafo uno.\n\nPárrafo dos.\n';
        expect(formatMarkdown(input)).toBe(expected);
    });

    it('trims trailing whitespace but preserves intentional two-space linebreaks', () => {
        const input = 'Línea con espacios sobrantes    \nLínea con dos espacios suaves  \nTercera línea.';
        const result = formatMarkdown(input);
        expect(result).toContain('Línea con espacios sobrantes\n');
        expect(result).toContain('Línea con dos espacios suaves  \n');
    });

    it('normalizes headings by ensuring a space after # and cleaning closing hashes', () => {
        const input = '#Título Pegado\n###Subtítulo Pegado###\n##### Nivel 5';
        const result = formatMarkdown(input);
        expect(result).toContain('# Título Pegado');
        expect(result).toContain('### Subtítulo Pegado');
        expect(result).toContain('##### Nivel 5');
    });

    it('normalizes unordered lists to dashes and ensures single space after bullet', () => {
        const input = '* Elemento uno\n+ Elemento dos\n- Elemento tres';
        const result = formatMarkdown(input);
        expect(result).toContain('- Elemento uno');
        expect(result).toContain('- Elemento dos');
        expect(result).toContain('- Elemento tres');
    });

    it('renumbers disordered ordered lists sequentially', () => {
        const input = '1. Primero\n5. Segundo\n2. Tercero\n9. Cuarto';
        const expected = '1. Primero\n2. Segundo\n3. Tercero\n4. Cuarto\n';
        expect(formatMarkdown(input)).toBe(expected);
    });

    it('normalizes GFM task list items', () => {
        const input = '* [ ] Tarea pendiente\n- [X] Tarea completada con X mayúscula\n+ [x] Tarea hecha';
        const result = formatMarkdown(input);
        expect(result).toContain('- [ ] Tarea pendiente');
        expect(result).toContain('- [x] Tarea completada con X mayúscula');
        expect(result).toContain('- [x] Tarea hecha');
    });

    it('aligns GFM table columns and preserves alignments', () => {
        const input = '| Producto | Cantidad | Precio |\n|---|:---:|---:|\n| Manzana roja deliciosa | 50 | $1.20 |\n| Pera | 4 | $0.90 |';
        const result = formatMarkdown(input);
        
        expect(result).toContain('| Producto               | Cantidad | Precio |');
        expect(result).toContain('| ---------------------- | :------: | -----: |');
        expect(result).toContain('| Manzana roja deliciosa |    50    |  $1.20 |');
        expect(result).toContain('| Pera                   |    4     |  $0.90 |');
    });

    it('normalizes horizontal rules and ensures spacing', () => {
        const input = 'Texto antes\n***\nTexto después';
        const result = formatMarkdown(input);
        expect(result).toBe('Texto antes\n\n---\n\nTexto después\n');
    });

    it('strictly preserves code block syntax, indentation and whitespace', () => {
        const input = '# Título\n\n```javascript\nfunction hello() {\n    const a = 1;    \n        return a;\n}\n```\n\nFin.';
        const result = formatMarkdown(input);
        expect(result).toContain('```javascript\nfunction hello() {\n    const a = 1;    \n        return a;\n}\n```');
    });

    it('strictly preserves display math block contents', () => {
        const input = '$$\n\\int_{0}^{1} x^2 dx = \\frac{1}{3}\n$$\n';
        const result = formatMarkdown(input);
        expect(result).toBe('$$\n\\int_{0}^{1} x^2 dx = \\frac{1}{3}\n$$\n');
    });

    it('is completely idempotent (formatting multiple times produces the same result)', () => {
        const input = '# Encabezado\n\nTexto con *énfasis* y **negrita**.\n\n- Lista 1\n- Lista 2\n\n| A | B |\n| --- | --- |\n| 1 | 2 |\n';
        const first = formatMarkdown(input);
        const second = formatMarkdown(first);
        const third = formatMarkdown(second);
        expect(second).toBe(first);
        expect(third).toBe(first);
    });
});
