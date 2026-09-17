import { state } from '../core/state.js';
import { EditorService, ParserManager } from './editor.service.js';
import { EditorView } from './editor.view.js';
import { closeAllDropdowns, toggleDropdown, setupDropdownKeyboardNav } from '../ui/dropdown.util.js';
import { clearGrammarMatches } from '../api/grammar/grammar.controller.js';
import { ToastView } from '../ui/toast.view.js';
import { StorageService } from '../core/storage.service.js';

export function persistDraft() {
    const editor = EditorView.elements.editor;
    const val = editor?.value ?? '';
    if (val.trim().length > 0) {
        const saved = StorageService.saveDraft(val);
        if (saved) {
            const time = StorageService.formatTime(saved.updatedAt);
            EditorView.setSaveStatus('saved', { time });
        } else {
            EditorView.setSaveStatus('error');
        }
    } else {
        StorageService.clearDraft();
        EditorView.setSaveStatus('idle');
    }
}

export function initEditorController() {
    const { editor } = EditorView.elements;
    let typingTimer = null;
    let saveDraftTimer = null;

    // Actualizar vista previa en tiempo real si cambia el perfil de Markdown
    ParserManager.subscribe(() => {
        if (state.isPreviewVisible) {
            EditorView.updatePreview(true);
        }
    });

    editor.addEventListener('input', (e) => {
        EditorView.updateCounters();
        if (state.isPreviewVisible) EditorView.updatePreview();

        // Si el usuario modifica el texto directamente, invalidar sugerencias obsoletas.
        // Las correcciones aplicadas desde el panel gramatical preservan los matches con shiftOffsetsAfter.
        if (e?.detail?.source !== 'grammar-fix' && state.currentMatches && state.currentMatches.length > 0) {
            clearGrammarMatches();
        }

        // Capa 1: Estado visual inmediato y persistencia en micropausas (debounce)
        EditorView.setSaveStatus('saving');
        if (saveDraftTimer) clearTimeout(saveDraftTimer);
        saveDraftTimer = setTimeout(() => {
            persistDraft();
            saveDraftTimer = null;
        }, 500);

        if (typingTimer) clearTimeout(typingTimer);
        state.setTyping(true);
        typingTimer = setTimeout(() => {
            state.history.push(editor.value);
            state.setTyping(false);
            typingTimer = null;
        }, 800);
    });

    // Capa 2 y 3: Guardado inmediato ante minimización, cambio de pestaña o cierre súbito
    const flushSave = () => {
        if (saveDraftTimer) {
            clearTimeout(saveDraftTimer);
            saveDraftTimer = null;
        }
        persistDraft();
    };

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') flushSave();
    });

    window.addEventListener('blur', flushSave);
    window.addEventListener('beforeunload', flushSave);

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

        // Más formatos & Listas & Ecuación (Ctrl+Shift+N)
        if (isCtrlOrCmd && !isAlt && isShift) {
            if (key === 's') { e.preventDefault(); moreFormatAction('strikethrough'); return; }
            if (key === 'm') { e.preventDefault(); moreFormatAction('code'); return; }
            if (key === 'l') { e.preventDefault(); listStyleAction('unordered'); return; }
            if (key === 'n') { e.preventDefault(); listStyleAction('ordered'); return; }
            if (key === 't') { e.preventDefault(); listStyleAction('task'); return; }
            if (key === 'e') { e.preventDefault(); insertElementAction('math'); return; }
        }

        // Borrar formato (Ctrl+\)
        if (isCtrlOrCmd && !isAlt && !isShift && (e.key === '\\' || e.code === 'Backslash')) {
            e.preventDefault();
            moreFormatAction('clear');
            return;
        }

        // Negrita (Ctrl+B), Cursiva (Ctrl+I), Enlace (Ctrl+K)
        if (isCtrlOrCmd && !isAlt && !isShift) {
            if (key === 'b') { e.preventDefault(); triggerEditorAction('**', '**'); return; }
            if (key === 'i') { e.preventDefault(); triggerEditorAction('*', '*'); return; }
            if (key === 'k') { e.preventDefault(); insertElementAction('link'); return; }
        }
    });

    // Atajos globales de modo de visualización (funcionan en cualquier modo, incluso con editor oculto)
    document.addEventListener('keydown', (e) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const isAlt = e.altKey;
        const isShift = e.shiftKey;
        const key = e.key ? e.key.toLowerCase() : '';

        if (isCtrlOrCmd && isAlt && !isShift) {
            if (key === 'e') { e.preventDefault(); EditorView.setViewMode('editor'); return; }
            if (key === 's') { e.preventDefault(); EditorView.toggleSplitMode(); return; }
            if (key === 'p') {
                e.preventDefault();
                if (state.viewMode !== 'split') {
                    EditorView.toggleViewMode();
                }
                return;
            }
        }
    });

    // Botón 1: Alternar entre editor y vista previa
    document.getElementById('toggleViewBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.viewMode === 'split') return;
        EditorView.toggleViewMode();
    });

    // Botón 2: Alternar vista dividida (Split View) similar a toggleSidebarBtn
    document.getElementById('toggleSplitBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        EditorView.toggleSplitMode();
    });

    // Inicializar scroll sincronizado entre editor y preview en modo dividido
    setupScrollSync();

    // Manejo accesible de despliegue de menús desplegables
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown(trigger);
        });
    });

    setupDropdownKeyboardNav();

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
            else if (action === 'undo') performUndo();
            else if (action === 'redo') performRedo();
            else if (action === 'copy') copyText();
            else if (action === 'clear') clearEditor();

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
            if (state.isPreviewVisible) EditorView.updatePreview();
            clearGrammarMatches();
            persistDraft();
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
    const { editor } = EditorView.elements;
    const content = editor.value;

    if (!content || !content.trim()) {
        ToastView.show("El editor está vacío", "info");
        return;
    }

    // Asegurar que el contenido renderizado esté actualizado de forma síncrona,
    // garantizando que el DOM esté listo antes de que el navegador abra el diálogo de impresión.
    EditorView.updatePreview(true);

    const title = EditorService.downloadPdf(content);
    ToastView.show(`Abriendo diálogo de impresión (${title})`, "success");
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
    } else if (type === 'callout') {
        EditorService.insertCallout(editor);
    } else if (type === 'table') {
        EditorService.insertTable(editor);
    } else if (type === 'math') {
        EditorService.insertMath(editor);
    } else if (type === 'footnote') {
        EditorService.insertFootnote(editor);
    } else if (type === 'divider') {
        EditorService.insertDivider(editor);
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
        if (state.isPreviewVisible) EditorView.updatePreview(true);
        persistDraft();
    }
}

function performRedo() {
    const next = state.history.redo();
    if (next !== null) { 
        EditorView.elements.editor.value = next; 
        EditorView.updateCounters();
        if (state.isPreviewVisible) EditorView.updatePreview(true);
        persistDraft();
    }
}

function copyText() {
    const { editor } = EditorView.elements;
    const text = editor.value;

    if (!text || !text.trim()) {
        ToastView.show("No hay texto para copiar", "info");
        return;
    }

    if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            ToastView.show("Copiado al portapapeles", "success");
        }).catch(() => {
            fallbackCopyText(text);
        });
    } else {
        fallbackCopyText(text);
    }
}

function fallbackCopyText(text) {
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) {
            ToastView.show("Copiado al portapapeles", "success");
        } else {
            ToastView.show("No se pudo copiar el texto", "error");
        }
    } catch {
        ToastView.show("No se pudo copiar el texto", "error");
    }
}

function clearEditor() {
    const { editor } = EditorView.elements;
    if (!editor.value) {
        ToastView.show("El editor ya está vacío", "info");
        return;
    }
    editor.value = '';
    EditorView.updateCounters();
    if (state.isPreviewVisible) EditorView.updatePreview(true);
    state.history.push('');
    clearGrammarMatches();
    StorageService.clearDraft();
    EditorView.setSaveStatus('idle');
    ToastView.show("Contenido eliminado", "info");
}

function setupScrollSync() {
    const { editor, previewPanel } = EditorView.elements;
    if (!editor || !previewPanel) return;

    let isSyncingFromEditor = false;
    let isSyncingFromPreview = false;

    editor.addEventListener('scroll', () => {
        if (state.viewMode !== 'split') return;
        if (isSyncingFromPreview) return;

        isSyncingFromEditor = true;
        const maxEditorScroll = editor.scrollHeight - editor.clientHeight;
        if (maxEditorScroll > 0) {
            const scrollPct = editor.scrollTop / maxEditorScroll;
            const maxPreviewScroll = previewPanel.scrollHeight - previewPanel.clientHeight;
            previewPanel.scrollTop = scrollPct * maxPreviewScroll;
        }
        requestAnimationFrame(() => {
            isSyncingFromEditor = false;
        });
    }, { passive: true });

    previewPanel.addEventListener('scroll', () => {
        if (state.viewMode !== 'split') return;
        if (isSyncingFromEditor) return;

        isSyncingFromPreview = true;
        const maxPreviewScroll = previewPanel.scrollHeight - previewPanel.clientHeight;
        if (maxPreviewScroll > 0) {
            const scrollPct = previewPanel.scrollTop / maxPreviewScroll;
            const maxEditorScroll = editor.scrollHeight - editor.clientHeight;
            editor.scrollTop = scrollPct * maxEditorScroll;
        }
        requestAnimationFrame(() => {
            isSyncingFromPreview = false;
        });
    }, { passive: true });
}