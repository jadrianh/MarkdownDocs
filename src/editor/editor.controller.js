import { state } from '../core/state.js';
import { EditorService } from './editor.service.js';
import { EditorView } from './editor.view.js';
import { ToastView } from '../ui/toast.view.js';

export function initEditorController() {
    const { editor } = EditorView.elements;

    editor.addEventListener('input', () => {
        EditorView.updateCounters();
        if (state.isPreviewMode) EditorView.updatePreview();

        if (!state.isTyping) {
            state.setTyping(true);
            setTimeout(() => {
                state.history.push(editor.value);
                state.setTyping(false);
            }, 1000);
        }
    });

    // Manejo de atajos de teclado para la barra de herramientas
    editor.addEventListener('keydown', (e) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const isAlt = e.altKey;
        const isShift = e.shiftKey;
        const key = e.key ? e.key.toLowerCase() : '';

        // Deshacer (Ctrl+Z) y Rehacer (Ctrl+Shift+Z)
        if (isCtrlOrCmd && !isAlt && !isShift && key === 'z') { e.preventDefault(); performUndo(); return; }
        if (isCtrlOrCmd && !isAlt && isShift && key === 'z') { e.preventDefault(); performRedo(); return; }

        // Analizar (Ctrl+Enter)
        if (isCtrlOrCmd && e.key === 'Enter') { 
            e.preventDefault(); 
            document.getElementById('analyzeBtn')?.click(); 
            return;
        }

        // Estilos de texto & Insertar Elementos (Ctrl+Alt+N)
        if (isCtrlOrCmd && isAlt && !isShift) {
            if (e.key === '0' || e.code === 'Digit0') { e.preventDefault(); applyHeaderStyle(0); return; }
            if (e.key === '1' || e.code === 'Digit1') { e.preventDefault(); applyHeaderStyle(1); return; }
            if (e.key === '2' || e.code === 'Digit2') { e.preventDefault(); applyHeaderStyle(2); return; }
            if (e.key === '3' || e.code === 'Digit3') { e.preventDefault(); applyHeaderStyle(3); return; }
            if (e.key === '4' || e.code === 'Digit4') { e.preventDefault(); insertElementAction('link'); return; }
            if (e.key === '5' || e.code === 'Digit5') { e.preventDefault(); insertElementAction('codeblock'); return; }
            if (e.key === '6' || e.code === 'Digit6') { e.preventDefault(); insertElementAction('quote'); return; }
        }

        // Más formatos & Listas (Ctrl+Shift+N)
        if (isCtrlOrCmd && !isAlt && isShift) {
            if (key === 's') { e.preventDefault(); moreFormatAction('strikethrough'); return; }
            if (key === 'm') { e.preventDefault(); moreFormatAction('code'); return; }
            if (key === 'l') { e.preventDefault(); listStyleAction('unordered'); return; }
            if (key === 'n') { e.preventDefault(); listStyleAction('ordered'); return; }
        }

        // Borrar formato (Ctrl+\)
        if (isCtrlOrCmd && !isAlt && !isShift && (e.key === '\\' || e.code === 'Backslash')) {
            e.preventDefault();
            moreFormatAction('clear');
            return;
        }

        // Negrita (Ctrl+B) y Cursiva (Ctrl+I)
        if (isCtrlOrCmd && !isAlt && !isShift) {
            if (key === 'b') { e.preventDefault(); triggerEditorAction('**', '**'); return; }
            if (key === 'i') { e.preventDefault(); triggerEditorAction('*', '*'); return; }
        }
    });

    document.getElementById('toggleViewBtn')?.addEventListener('click', () => EditorView.toggleViewMode());

    // Manejo de despliegue de menús desplegables personalizados de la Toolbar
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const container = trigger.closest('.dropdown-container');
            const menu = container?.querySelector('.dropdown-menu');
            
            document.querySelectorAll('.dropdown-menu').forEach(m => {
                if (m !== menu) m.classList.add('hidden');
            });

            menu?.classList.toggle('hidden');
        });
    });

    // Manejo de clic en opciones de los menús desplegables
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = item.dataset.action;
            const value = item.dataset.value;

            if (action === 'header') applyHeaderStyle(parseInt(value, 10));
            else if (action === 'moreFormat') moreFormatAction(value);
            else if (action === 'listStyle') listStyleAction(value);
            else if (action === 'insertElement') insertElementAction(value);

            closeAllDropdowns();
        });
    });

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            closeAllDropdowns();
        }
    });

    // 2. Negrita & 3. Cursiva [Buttons]
    document.getElementById('btnBold')?.addEventListener('click', () => triggerEditorAction('**', '**'));
    document.getElementById('btnItalic')?.addEventListener('click', () => triggerEditorAction('*', '*'));

    document.getElementById('importMdBtn')?.addEventListener('click', () => {
        document.getElementById('importFileInput')?.click();
    });

    document.getElementById('importFileInput')?.addEventListener('change', handleFileImport);

    document.getElementById('downloadMdBtn')?.addEventListener('click', downloadMarkdownFile);
    document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPdfFile);
    document.getElementById('undoBtn')?.addEventListener('click', performUndo);
    document.getElementById('redoBtn')?.addEventListener('click', performRedo);
    document.getElementById('copyBtn')?.addEventListener('click', copyText);
    document.getElementById('clearBtn')?.addEventListener('click', clearEditor);
    
    document.getElementById('exampleBtn')?.addEventListener('click', () => {
        editor.value = "# El Arte de Escribir\n\nLa escritura es la pintura de la voz. Cada palabra es una pincelada que da forma al pensamiento.";
        state.history.push(editor.value);
        EditorView.updateCounters();
    });
}

function handleFileImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.md') && !fileName.endsWith('.markdown')) {
        ToastView.show("Por favor selecciona un archivo Markdown (.md)", "error");
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
            const { editor } = EditorView.elements;
            editor.value = text;
            state.history.push(text);
            EditorView.updateCounters();
            if (state.isPreviewMode) EditorView.updatePreview();
            ToastView.show(`Archivo "${file.name}" importado`, "success");
        }
        e.target.value = '';
    };

    reader.onerror = () => {
        ToastView.show("Error al leer el archivo", "error");
        e.target.value = '';
    };

    reader.readAsText(file);
}

async function downloadMarkdownFile() {
    const { editor } = EditorView.elements;
    const content = editor.value;

    if (!content || !content.trim()) {
        ToastView.show("El editor está vacío", "info");
        return;
    }

    const downloadedName = await EditorService.downloadMarkdown(content);
    if (downloadedName) {
        ToastView.show(`Guardado (${downloadedName})`, "success");
    }
}

function downloadPdfFile() {
    const { editor, previewPanel } = EditorView.elements;
    const content = editor.value;

    if (!content || !content.trim()) {
        ToastView.show("El editor está vacío", "info");
        return;
    }

    // Asegurar que el contenido renderizado esté actualizado
    EditorView.updatePreview();

    const title = EditorService.downloadPdf(content, previewPanel);
    if (title) {
        ToastView.show(`Generando PDF (${title})`, "success");
    } else {
        ToastView.show("No se pudo abrir la ventana de impresión", "error");
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
}

function applyHeaderStyle(level) {
    const { editor } = EditorView.elements;
    EditorService.applyHeader(editor, level);
    dispatchEditorChange();
}

function moreFormatAction(type) {
    const { editor } = EditorView.elements;
    if (type === 'strikethrough') {
        EditorService.toggleStyle(editor, '~~', '~~');
    } else if (type === 'code') {
        EditorService.toggleStyle(editor, '`', '`');
    } else if (type === 'clear') {
        EditorService.clearFormatting(editor);
    }
    dispatchEditorChange();
}

function listStyleAction(type) {
    const { editor } = EditorView.elements;
    EditorService.makeList(editor, type);
    dispatchEditorChange();
}

function insertElementAction(type) {
    const { editor } = EditorView.elements;
    if (type === 'link') {
        EditorService.insertLink(editor);
    } else if (type === 'codeblock') {
        EditorService.insertCodeBlock(editor);
    } else if (type === 'quote') {
        EditorService.insertQuote(editor);
    }
    dispatchEditorChange();
}

function triggerEditorAction(prefix, suffix) {
    EditorService.toggleStyle(EditorView.elements.editor, prefix, suffix);
    dispatchEditorChange();
}

function dispatchEditorChange() {
    EditorView.elements.editor.focus();
    EditorView.elements.editor.dispatchEvent(new Event('input'));
}

function performUndo() {
    const prev = state.history.undo();
    if (prev !== null) { 
        EditorView.elements.editor.value = prev; 
        EditorView.updateCounters();
        if (state.isPreviewMode) EditorView.updatePreview();
    }
}

function performRedo() {
    const next = state.history.redo();
    if (next !== null) { 
        EditorView.elements.editor.value = next; 
        EditorView.updateCounters();
        if (state.isPreviewMode) EditorView.updatePreview();
    }
}

function copyText() {
    navigator.clipboard.writeText(EditorView.elements.editor.value);
    ToastView.show("Copiado", "success");
}

function clearEditor() {
    EditorView.elements.editor.value = '';
    EditorView.updateCounters();
    if (state.isPreviewMode) EditorView.updatePreview();
    state.history.push('');
    ToastView.show("Contenido eliminado", "info");
}