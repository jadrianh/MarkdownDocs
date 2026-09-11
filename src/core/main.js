import { state } from './state.js';
import { ThemeManager } from '../theme/themeManager.js';
import { EditorView } from '../editor/editor.view.js';
import { GrammarView } from '../api/grammar/grammar.view.js';
import { initEditorController } from '../editor/editor.controller.js';
import { initGrammarController } from '../api/grammar/grammar.controller.js';
import { initParserController } from '../editor/parsers/parser.controller.js';
import { StorageService } from './storage.service.js';
import { ToastView } from '../ui/toast.view.js';

import {
    renderToastContainer,
    renderNavbar,
    NavbarView,
    renderWorkspace,
    renderPreferencesModal,
    PreferencesModalView
} from '../components/index.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Montar componentes estructurales
    const toastRoot = document.getElementById('app-toast-root');
    if (toastRoot) {
        toastRoot.outerHTML = renderToastContainer();
    }

    const headerRoot = document.getElementById('app-header-root');
    if (headerRoot) {
        headerRoot.outerHTML = renderNavbar();
    }

    const workspaceRoot = document.getElementById('app-workspace-root');
    if (workspaceRoot) {
        workspaceRoot.innerHTML = renderWorkspace();
    }

    const modalRoot = document.getElementById('app-modal-root');
    if (modalRoot) {
        modalRoot.innerHTML = renderPreferencesModal();
    }

    // Debe ir antes de los controladores: ahora elements se captura
    // explícitamente aquí en vez de al importar cada módulo de vista.
    NavbarView.init();
    PreferencesModalView.init();
    EditorView.init();
    GrammarView.init();

    ThemeManager.init();

    const editorElement = document.getElementById('editor');
    if (editorElement) {
        const savedDraft = StorageService.loadDraft();
        if (savedDraft && typeof savedDraft.content === 'string' && savedDraft.content.trim().length > 0) {
            editorElement.value = savedDraft.content;
            state.history.push(savedDraft.content);
            EditorView.updateCounters();
            EditorView.updatePreview(true);
            const time = StorageService.formatTime(savedDraft.updatedAt);
            EditorView.setSaveStatus('saved', { time });
            ToastView.show("Borrador recuperado automáticamente", "info");
        } else {
            state.history.push(editorElement.value);
            EditorView.updateCounters();
            EditorView.setSaveStatus('idle');
        }
    }

    initEditorController();
    initGrammarController();
    initParserController();
});