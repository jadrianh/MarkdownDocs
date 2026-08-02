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

    editor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); performUndo(); }
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') { e.preventDefault(); performRedo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { 
            e.preventDefault(); 
            document.getElementById('analyzeBtn').click(); 
        }
    });

    document.getElementById('toggleViewBtn').addEventListener('click', () => EditorView.toggleViewMode());

    document.getElementById('btnBold').addEventListener('click', () => triggerEditorAction('**', '**'));
    document.getElementById('btnItalic').addEventListener('click', () => triggerEditorAction('*', '*'));
    document.getElementById('btnHeader').addEventListener('click', () => triggerEditorAction('## ', ''));
    
    document.getElementById('btnListUl').addEventListener('click', () => {
        EditorService.makeList(editor, 'unordered');
        dispatchEditorChange();
    });
    
    document.getElementById('btnListOl').addEventListener('click', () => {
        EditorService.makeList(editor, 'ordered');
        dispatchEditorChange();
    });

    document.getElementById('undoBtn').addEventListener('click', performUndo);
    document.getElementById('redoBtn').addEventListener('click', performRedo);
    document.getElementById('copyBtn').addEventListener('click', copyText);
    document.getElementById('clearBtn').addEventListener('click', clearEditor);
    
    document.getElementById('exampleBtn').addEventListener('click', () => {
        editor.value = "# El Arte de Escribir\n\nLa escritura es la pintura de la voz. Cada palabra es una pincelada que da forma al pensamiento.";
        state.history.push(editor.value);
        EditorView.updateCounters();
    });
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
    }
}

function performRedo() {
    const next = state.history.redo();
    if (next !== null) { 
        EditorView.elements.editor.value = next; 
        EditorView.updateCounters();
    }
}

function copyText() {
    navigator.clipboard.writeText(EditorView.elements.editor.value);
    ToastView.show("Copiado", "success");
}

function clearEditor() {
    EditorView.elements.editor.value = '';
    EditorView.updateCounters();
    state.history.push('');
    ToastView.show("Contenido eliminado", "info");
}