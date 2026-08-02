import { state } from '../../core/state.js';
import { LanguageToolAPI } from '../languageTool.Client.js';
import { GrammarView } from './grammar.view.js';
import { EditorView } from '../../editor/editor.view.js';
import { ToastView } from '../../ui/toast.view.js';

export function initGrammarController() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const editor = document.getElementById('editor');

    // Sincronizar UI de idioma inicial con el estado guardado
    updateLanguageUI(state.currentLanguage);

    // Escuchador de eventos para selección de idioma
    document.querySelectorAll('.dropdown-lang-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = item.dataset.lang;
            const label = item.dataset.label;

            state.setLanguage(lang);
            updateLanguageUI(lang, label);

            ToastView.show(`Idioma: ${label}`, "info");

            document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
        });
    });

    analyzeBtn?.addEventListener('click', async () => {
        if (state.isPreviewMode) EditorView.toggleViewMode();

        const text = editor.value;
        
        if (!text || !text.trim()) {
            ToastView.show("El editor está vacío", "info");
            return;
        }

        GrammarView.toggleLoading(true);

        try {
            const data = await LanguageToolAPI.check(text, state.currentLanguage || 'es');
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

function updateLanguageUI(lang, label) {
    const currentLangText = document.getElementById('currentLangText');
    
    document.querySelectorAll('.dropdown-lang-item').forEach(item => {
        const check = item.querySelector('.lang-check');
        if (item.dataset.lang === lang) {
            if (check) check.classList.remove('opacity-0');
            if (currentLangText) currentLangText.textContent = label || item.dataset.label;
        } else {
            if (check) check.classList.add('opacity-0');
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