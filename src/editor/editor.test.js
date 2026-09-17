import { describe, it, expect, beforeEach } from 'vitest';
import { EditorService } from './editor.service.js';
import { state } from '../core/state.js';

describe('EditorService & State', () => {
    let textarea;

    beforeEach(() => {
        textarea = {
            value: '',
            selectionStart: 0,
            selectionEnd: 0
        };
    });

    it('toggles bold style around selected text', () => {
        textarea.value = 'hello world';
        textarea.selectionStart = 0;
        textarea.selectionEnd = 5;

        EditorService.toggleStyle(textarea, '**', '**');
        expect(textarea.value).toBe('**hello** world');
    });

    it('untoggles bold style if already formatted', () => {
        textarea.value = '**hello** world';
        textarea.selectionStart = 0;
        textarea.selectionEnd = 9;

        EditorService.toggleStyle(textarea, '**', '**');
        expect(textarea.value).toBe('hello world');
    });

    it('applies headers correctly', () => {
        textarea.value = 'Mi titulo';
        textarea.selectionStart = 3;
        textarea.selectionEnd = 3;

        EditorService.applyHeader(textarea, 1);
        expect(textarea.value).toBe('# Mi titulo');

        EditorService.applyHeader(textarea, 2);
        expect(textarea.value).toBe('## Mi titulo');
    });

    it('clears formatting correctly', () => {
        textarea.value = 'Texto con **negrita** y *cursiva* y `codigo`';
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;

        EditorService.clearFormatting(textarea);
        expect(textarea.value).toBe('Texto con negrita y cursiva y codigo');
    });

    it('creates bullet, numbered, and task lists', () => {
        textarea.value = 'Linea 1\nLinea 2';
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;

        EditorService.makeList(textarea, 'unordered');
        expect(textarea.value).toBe('- Linea 1\n- Linea 2');

        EditorService.makeList(textarea, 'ordered');
        expect(textarea.value).toBe('1. Linea 1\n2. Linea 2');

        EditorService.makeList(textarea, 'task');
        expect(textarea.value).toBe('- [ ] Linea 1\n- [ ] Linea 2');
    });

    it('inserts callout block correctly', () => {
        textarea.value = 'Nota importante';
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;

        EditorService.insertCallout(textarea, 'TIP');
        expect(textarea.value).toContain('> [!TIP]');
        expect(textarea.value).toContain('> Nota importante');
    });

    it('inserts markdown table structure', () => {
        textarea.value = '';
        textarea.selectionStart = 0;
        textarea.selectionEnd = 0;

        EditorService.insertTable(textarea, 2, 3);
        expect(textarea.value).toContain('| Encabezado 1 | Encabezado 2 | Encabezado 3 |');
        expect(textarea.value).toContain('| ------------ | ------------ | ------------ |');
        expect(textarea.value).toContain('| Celda 1 | Celda 2 | Celda 3 |');
    });

    it('inserts math equations for inline and block', () => {
        // Inline math
        textarea.value = 'E = mc^2';
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;

        EditorService.insertMath(textarea);
        expect(textarea.value).toBe('$E = mc^2$');

        // Block math
        textarea.value = 'x + y = z\na + b = c';
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;

        EditorService.insertMath(textarea, true);
        expect(textarea.value).toContain('$$\nx + y = z\na + b = c\n$$');
    });

    it('inserts footnote reference and appends definition', () => {
        textarea.value = 'Texto con referencia';
        textarea.selectionStart = textarea.value.length;
        textarea.selectionEnd = textarea.value.length;

        EditorService.insertFootnote(textarea);
        expect(textarea.value).toContain('Texto con referencia[^1]');
        expect(textarea.value).toContain('[^1]: Texto explicativo de la nota.');
    });

    it('inserts horizontal divider', () => {
        textarea.value = 'Seccion 1';
        textarea.selectionStart = textarea.value.length;
        textarea.selectionEnd = textarea.value.length;

        EditorService.insertDivider(textarea);
        expect(textarea.value).toContain('Seccion 1\n\n---\n\n');
    });

    it('parses markdown to HTML safely', () => {
        const html = EditorService.parseMarkdown('# Hola Mundo\n\nEste es un parrafo con **negrita**.');
        expect(html).toContain('<h1>Hola Mundo</h1>');
        expect(html).toContain('<strong>negrita</strong>');
    });

    it('neutralizes malicious scripts', () => {
        const html = EditorService.parseMarkdown('<script>alert("xss")</script>Texto');
        expect(html).not.toContain('<script>');
    });

    it('manages sidebar state properly', () => {
        state.setSidebarOpen(true);
        expect(state.isSidebarOpen).toBe(true);

        state.setSidebarOpen(false);
        expect(state.isSidebarOpen).toBe(false);
    });

    it('shifts match offsets correctly after text edit', () => {
        state.setMatches([
            { offset: 5, length: 4 },
            { offset: 20, length: 3 }
        ]);

        state.shiftOffsetsAfter(5, 6); // offset 20 should become 26
        expect(state.currentMatches[1].offset).toBe(26);
    });

    it('manages viewMode and split view visibility states correctly', () => {
        state.setViewMode('editor');
        expect(state.viewMode).toBe('editor');
        expect(state.isEditorVisible).toBe(true);
        expect(state.isPreviewVisible).toBe(false);
        expect(state.isPreviewMode).toBe(false);

        state.setViewMode('split');
        expect(state.viewMode).toBe('split');
        expect(state.isEditorVisible).toBe(true);
        expect(state.isPreviewVisible).toBe(true);
        expect(state.isPreviewMode).toBe(false);

        state.setViewMode('preview');
        expect(state.viewMode).toBe('preview');
        expect(state.isEditorVisible).toBe(false);
        expect(state.isPreviewVisible).toBe(true);
        expect(state.isPreviewMode).toBe(true);

        // Backward compatibility
        state.setPreviewMode(false);
        expect(state.viewMode).toBe('editor');
        expect(state.isPreviewMode).toBe(false);
    });

    it('handles downloadPdf using #nativePrintRoot and window.print()', async () => {
        let printCalled = false;
        window.print = () => {
            printCalled = true;
            const root = document.getElementById('nativePrintRoot');
            expect(root).toBeTruthy();
            expect(root.innerHTML).toContain('Mi Titulo de Documento');
        };

        const title = await EditorService.downloadPdf('# Mi Titulo de Documento\n\nContenido de prueba.');
        expect(title).toBe('Mi Titulo de Documento');
        expect(printCalled).toBe(true);

        // After print, printRoot should be emptied
        const root = document.getElementById('nativePrintRoot');
        expect(root.innerHTML).toBe('');
    });

    it('formats markdown documents via formatMarkdown()', () => {
        const input = '#Titulo\n\n- item 1\n* item 2\n\n| A | B |\n|---|---|\n| 1 | 2 |\n';
        const formatted = EditorService.formatMarkdown(input);
        expect(formatted).toContain('# Titulo');
        expect(formatted).toContain('- item 1\n- item 2');
        expect(formatted).toContain('| A   | B   |');
    });
});


