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

    it('creates bullet and numbered lists', () => {
        textarea.value = 'Linea 1\nLinea 2';
        textarea.selectionStart = 0;
        textarea.selectionEnd = textarea.value.length;

        EditorService.makeList(textarea, 'unordered');
        expect(textarea.value).toBe('- Linea 1\n- Linea 2');

        EditorService.makeList(textarea, 'ordered');
        expect(textarea.value).toBe('1. Linea 1\n2. Linea 2');
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
});
