import { state } from '../../core/state.js';
import { LanguageToolAPI } from '../languageTool.Client.js';
import { GrammarView } from './grammar.view.js';
import { EditorView } from '../../editor/editor.view.js';
import { ToastView } from '../../ui/toast.view.js';
import { closeAllDropdowns } from '../../ui/dropdown.util.js';
import { OutlineView } from '../../editor/outline/outline.view.js';

export function initGrammarController() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const editor = document.getElementById('editor');

    // Inicializar estado del panel lateral
    GrammarView.updateSidebarUI(state.isSidebarOpen);

    // Alternar visibilidad del panel lateral
    document.getElementById('toggleSidebarBtn')?.addEventListener('click', () => {
        state.setSidebarOpen(!state.isSidebarOpen);
        GrammarView.updateSidebarUI(state.isSidebarOpen);
    });

    // Cerrar panel lateral desde el botón del encabezado
    document.getElementById('closeSidebarBtn')?.addEventListener('click', () => {
        state.setSidebarOpen(false);
        GrammarView.updateSidebarUI(false);
    });

    // Cerrar panel lateral haciendo clic en el backdrop móvil
    document.getElementById('sidebarBackdrop')?.addEventListener('click', () => {
        state.setSidebarOpen(false);
        GrammarView.updateSidebarUI(false);
    });

    // Cerrar panel lateral con la tecla Escape en dispositivos móviles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isSidebarOpen && window.innerWidth < 768) {
            state.setSidebarOpen(false);
            GrammarView.updateSidebarUI(false);
        }
    });

    // Ajustar visibilidad del backdrop al cambiar tamaño de pantalla con rAF throttle
    let resizeRaf = null;
    window.addEventListener('resize', () => {
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
            resizeRaf = null;
            if (window.innerWidth >= 768) {
                document.getElementById('sidebarBackdrop')?.classList.add('hidden');
            } else if (state.isSidebarOpen) {
                document.getElementById('sidebarBackdrop')?.classList.remove('hidden');
            }
        });
    }, { passive: true });

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

            closeAllDropdowns();
        });
    });

    let isAnalyzing = false;

    const performAnalysis = async () => {
        if (isAnalyzing) return;
        if (state.isPreviewMode) EditorView.toggleViewMode();

        const text = editor.value;
        
        if (!text || !text.trim()) {
            ToastView.show("El editor está vacío", "info");
            return;
        }

        // Asegurar que el panel lateral esté abierto para ver resultados
        if (!state.isSidebarOpen) {
            state.setSidebarOpen(true);
            GrammarView.updateSidebarUI(true);
        }
        OutlineView.switchTab('suggestions');

        isAnalyzing = true;
        analyzeBtn?.setAttribute('disabled', 'true');
        analyzeBtn?.classList.add('opacity-70', 'cursor-not-allowed', 'is-analyzing');
        GrammarView.toggleLoading(true);

        try {
            const data = await LanguageToolAPI.check(text, state.currentLanguage || 'es');
            state.setMatches(data.matches);
            GrammarView.renderMatches(state.currentMatches, applyFixLocal, ignoreMatchLocal, selectMatchInEditor);
            ToastView.show("Análisis completado", "success");
        } catch (error) {
            console.error(error);
            GrammarView.renderErrorState(
                "No se pudo conectar con el servicio de revisión. Por favor verifica tu conexión o intenta nuevamente.",
                performAnalysis
            );
            ToastView.show("Error al analizar texto", "error");
        } finally {
            isAnalyzing = false;
            analyzeBtn?.removeAttribute('disabled');
            analyzeBtn?.classList.remove('opacity-70', 'cursor-not-allowed', 'is-analyzing');
        }
    };

    analyzeBtn?.addEventListener('click', performAnalysis);
}

export function clearGrammarMatches() {
    if (state.currentMatches && state.currentMatches.length > 0) {
        state.setMatches([]);
        GrammarView.renderEmptyState();
    }
}

function updateLanguageUI(lang, label) {
    const currentLangText = document.getElementById('currentLangText');
    const editor = document.getElementById('editor');
    const previewPanel = document.getElementById('previewPanel');

    // Soporte RTL para idiomas como árabe
    const isRtl = lang === 'ar';
    if (editor) editor.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    if (previewPanel) previewPanel.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    document.querySelectorAll('.dropdown-lang-item').forEach(item => {
        const check = item.querySelector('.lang-check');
        const isSelected = item.dataset.lang === lang;
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        if (isSelected) {
            if (check) check.classList.remove('opacity-0');
            const shortCode = item.querySelector('.font-semibold')?.textContent?.trim() || lang.slice(0, 2).toUpperCase();
            if (currentLangText) currentLangText.textContent = shortCode;
            const btnLanguage = document.getElementById('btnLanguage');
            if (btnLanguage) btnLanguage.title = `Idioma: ${label || item.dataset.label}`;
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
    state.shiftOffsetsAfter(offset, lengthDiff);
    state.removeMatch(matchIndex);
    state.history.push(editor.value);
    
    editor.focus();
    editor.dispatchEvent(new CustomEvent('input', { detail: { source: 'grammar-fix' } }));
  
    GrammarView.renderMatches(state.currentMatches, applyFixLocal, ignoreMatchLocal, selectMatchInEditor);
}

function ignoreMatchLocal(matchIndex) {
    state.removeMatch(matchIndex);
    GrammarView.renderMatches(state.currentMatches, applyFixLocal, ignoreMatchLocal, selectMatchInEditor);
    ToastView.show("Sugerencia descartada", "info");
}

function selectMatchInEditor(matchIndex) {
    const match = state.currentMatches[matchIndex];
    if (!match) return;

    if (state.isPreviewMode) {
        EditorView.toggleViewMode();
    }

    const editor = document.getElementById('editor');
    if (!editor) return;

    editor.focus();
    editor.setSelectionRange(match.offset, match.offset + match.length);

    // Resaltar visualmente la tarjeta seleccionada
    const cards = document.querySelectorAll('.suggestion-card');
    cards.forEach(card => {
        const idx = parseInt(card.dataset.index, 10);
        if (idx === matchIndex) {
            card.classList.add('active-match');
        } else {
            card.classList.remove('active-match');
        }
    });

    // Desplazar el textarea hacia la línea de la selección
    const textBefore = editor.value.substring(0, match.offset);
    const lineCount = textBefore.split('\n').length;
    const approxLineHeight = 24;
    const targetScroll = Math.max(0, (lineCount - 3) * approxLineHeight);
    editor.scrollTo({ top: targetScroll, behavior: 'smooth' });
}