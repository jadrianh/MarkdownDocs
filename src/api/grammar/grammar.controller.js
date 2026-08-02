import { state } from '../../core/state.js';
import { LanguageToolAPI } from '../languageTool.Client.js';
import { GrammarView } from './grammar.view.js';
import { EditorView } from '../../editor/editor.view.js';
import { ToastView } from '../../ui/toast.view.js';

export function initGrammarController() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const langSelect = document.getElementById('langSelect');
    const editor = document.getElementById('editor');

    analyzeBtn.addEventListener('click', async () => {
        if (state.isPreviewMode) EditorView.toggleViewMode();

        const text = editor.value;
        
        if (!text || !text.trim()) {
            ToastView.show("El editor está vacío", "info");
            return;
        }

        GrammarView.toggleLoading(true);

        try {
            const data = await LanguageToolAPI.check(text, langSelect.value);
            state.setMatches(data.matches);
            GrammarView.renderMatches(state.currentMatches, applyFixLocal);
            ToastView.show("Análisis completado", "success");
        } catch (error) {
            console.error(error);
            GrammarView.renderEmptyState();
            ToastView.show("Error de conexión", "error");
        }
    });
}

function applyFixLocal(matchIndex, replacement) {
    const match = state.currentMatches[matchIndex];
    if (!match) return;

    const editor = document.getElementById('editor');
    const original = editor.value;
    const offset = match.offset;
    const length = match.length;

    const newText = original.substring(0, offset) + replacement + original.substring(offset + length);
    editor.value = newText;
    
    const lengthDiff = replacement.length - length;

    for (let i = 0; i < state.currentMatches.length; i++) {
        if (i === matchIndex) continue;
        if (state.currentMatches[i].offset > offset) {
            state.currentMatches[i].offset += lengthDiff;
        }
    }

    state.removeMatch(matchIndex);
    state.history.push(editor.value);
    
    editor.focus();
    editor.dispatchEvent(new Event('input'));
  
    GrammarView.renderMatches(state.currentMatches, applyFixLocal);
}