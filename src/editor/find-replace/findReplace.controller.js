import { state } from '../../core/state.js';
import {
    findMatches,
    replaceCurrent,
    replaceAll,
    getNextIndex,
    getPrevIndex
} from './findReplace.service.js';
import { EditorView } from '../editor.view.js';
import { persistDraft } from '../editor.controller.js';
import { ToastView } from '../../ui/toast.view.js';

let matches = [];
let currentIndex = -1;
let matchCase = false;
let isOpen = false;
let isReplaceOpen = false;

function getElements() {
    return {
        widget: document.getElementById('findReplaceWidget'),
        toggleReplaceBtn: document.getElementById('findToggleReplaceBtn'),
        toggleReplaceIcon: document.getElementById('findToggleReplaceIcon'),
        findInput: document.getElementById('findInput'),
        countBadge: document.getElementById('findCountBadge'),
        matchCaseBtn: document.getElementById('findMatchCaseBtn'),
        prevBtn: document.getElementById('findPrevBtn'),
        nextBtn: document.getElementById('findNextBtn'),
        closeBtn: document.getElementById('findCloseBtn'),
        replaceRow: document.getElementById('replaceRow'),
        replaceInput: document.getElementById('replaceInput'),
        replaceBtn: document.getElementById('replaceBtn'),
        replaceAllBtn: document.getElementById('replaceAllBtn'),
        editor: document.getElementById('editor')
    };
}

export function openFindReplace(mode = 'find') {
    const el = getElements();
    if (!el.widget) return;

    // Si la vista actual es preview pura, cambiar a edición para poder buscar en el editor
    if (state.viewMode === 'preview') {
        EditorView.setViewMode('editor');
    }

    el.widget.classList.remove('hidden');
    isOpen = true;

    // Si hay texto seleccionado en el editor (en una sola línea y longitud razonable), usarlo como query
    if (el.editor && el.editor.selectionStart !== el.editor.selectionEnd) {
        const selected = el.editor.value.substring(el.editor.selectionStart, el.editor.selectionEnd);
        if (selected && !selected.includes('\n') && selected.length <= 100) {
            el.findInput.value = selected;
        }
    }

    if (mode === 'replace') {
        setReplaceRowVisible(true);
        if (el.findInput.value.trim().length > 0) {
            el.replaceInput.focus();
            el.replaceInput.select();
        } else {
            el.findInput.focus();
            el.findInput.select();
        }
    } else {
        el.findInput.focus();
        el.findInput.select();
    }

    performSearch();
}

export function closeFindReplace() {
    const el = getElements();
    if (!el.widget) return;

    el.widget.classList.add('hidden');
    isOpen = false;
    el.editor?.focus();
}

export function isFindReplaceOpen() {
    return isOpen;
}

function setReplaceRowVisible(show) {
    const el = getElements();
    if (!el.replaceRow) return;

    isReplaceOpen = show;
    if (show) {
        el.replaceRow.classList.remove('hidden');
        el.replaceRow.classList.add('flex');
        el.toggleReplaceBtn?.setAttribute('aria-expanded', 'true');
        el.toggleReplaceIcon?.classList.add('rotate-90');
    } else {
        el.replaceRow.classList.add('hidden');
        el.replaceRow.classList.remove('flex');
        el.toggleReplaceBtn?.setAttribute('aria-expanded', 'false');
        el.toggleReplaceIcon?.classList.remove('rotate-90');
    }
}

function toggleReplaceRow() {
    setReplaceRowVisible(!isReplaceOpen);
}

function toggleMatchCase() {
    const el = getElements();
    matchCase = !matchCase;

    if (matchCase) {
        el.matchCaseBtn?.classList.add('bg-primary', 'text-white');
        el.matchCaseBtn?.classList.remove('text-zinc-400');
        el.matchCaseBtn?.setAttribute('aria-pressed', 'true');
    } else {
        el.matchCaseBtn?.classList.remove('bg-primary', 'text-white');
        el.matchCaseBtn?.classList.add('text-zinc-400');
        el.matchCaseBtn?.setAttribute('aria-pressed', 'false');
    }

    performSearch();
}

function highlightMatch(match) {
    const el = getElements();
    if (!match || !el.editor) return;

    el.editor.focus();
    el.editor.setSelectionRange(match.start, match.end);

    // Calcular desplazamiento vertical proporcional para centrar la selección
    const textBefore = el.editor.value.substring(0, match.start);
    const lineIndex = textBefore.split('\n').length - 1;
    const totalLines = Math.max(1, el.editor.value.split('\n').length);
    const lineHeight = el.editor.scrollHeight / totalLines;

    const targetScrollTop = Math.max(0, lineIndex * lineHeight - el.editor.clientHeight / 2);
    el.editor.scrollTop = targetScrollTop;
}

function performSearch(keepIndex = false) {
    const el = getElements();
    if (!el.findInput || !el.editor) return;

    const query = el.findInput.value;
    if (!query) {
        matches = [];
        currentIndex = -1;
        if (el.countBadge) el.countBadge.textContent = '0 / 0';
        updateActionButtonsState(false);
        return;
    }

    matches = findMatches(el.editor.value, query, { matchCase });

    if (matches.length === 0) {
        currentIndex = -1;
        if (el.countBadge) el.countBadge.textContent = '0 / 0';
        updateActionButtonsState(false);
    } else {
        if (!keepIndex || currentIndex < 0 || currentIndex >= matches.length) {
            currentIndex = 0;
        }
        if (el.countBadge) el.countBadge.textContent = `${currentIndex + 1} / ${matches.length}`;
        updateActionButtonsState(true);
        highlightMatch(matches[currentIndex]);
    }
}

function updateActionButtonsState(hasMatches) {
    const el = getElements();
    if (el.prevBtn) el.prevBtn.disabled = !hasMatches;
    if (el.nextBtn) el.nextBtn.disabled = !hasMatches;
    if (el.replaceBtn) el.replaceBtn.disabled = !hasMatches;
    if (el.replaceAllBtn) el.replaceAllBtn.disabled = !hasMatches;
}

function nextMatch() {
    if (matches.length === 0) return;
    currentIndex = getNextIndex(currentIndex, matches.length);
    const el = getElements();
    if (el.countBadge) el.countBadge.textContent = `${currentIndex + 1} / ${matches.length}`;
    highlightMatch(matches[currentIndex]);
}

function prevMatch() {
    if (matches.length === 0) return;
    currentIndex = getPrevIndex(currentIndex, matches.length);
    const el = getElements();
    if (el.countBadge) el.countBadge.textContent = `${currentIndex + 1} / ${matches.length}`;
    highlightMatch(matches[currentIndex]);
}

function replaceCurrentMatch() {
    const el = getElements();
    if (!el.editor || matches.length === 0 || currentIndex < 0) return;

    const currentMatch = matches[currentIndex];
    const replacement = el.replaceInput ? el.replaceInput.value : '';

    const { newText, nextCursor } = replaceCurrent(el.editor.value, currentMatch, replacement);
    el.editor.value = newText;
    el.editor.setSelectionRange(nextCursor, nextCursor);

    // Registrar en historial de deshacer y persistir borrador
    state.history.push(newText);
    EditorView.updateCounters();
    if (state.isPreviewVisible) EditorView.updatePreview();
    persistDraft();

    // Actualizar resultados de búsqueda
    performSearch(true);
}

function replaceAllMatches() {
    const el = getElements();
    if (!el.editor || !el.findInput) return;

    const query = el.findInput.value;
    if (!query) return;

    const replacement = el.replaceInput ? el.replaceInput.value : '';
    const { newText, count } = replaceAll(el.editor.value, query, replacement, { matchCase });

    if (count > 0) {
        el.editor.value = newText;
        state.history.push(newText);
        EditorView.updateCounters();
        if (state.isPreviewVisible) EditorView.updatePreview();
        persistDraft();

        ToastView.show(`Se reemplazaron ${count} coincidencias`, 'success');
        performSearch();
    } else {
        ToastView.show('No se encontraron coincidencias para reemplazar', 'info');
    }
}

export function initFindReplaceController() {
    const el = getElements();

    el.toggleReplaceBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleReplaceRow();
    });

    el.matchCaseBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMatchCase();
    });

    el.findInput?.addEventListener('input', () => {
        performSearch();
    });

    el.findInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.shiftKey) {
                prevMatch();
            } else {
                nextMatch();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeFindReplace();
        }
    });

    el.replaceInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.ctrlKey || e.metaKey) {
                replaceAllMatches();
            } else {
                replaceCurrentMatch();
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            closeFindReplace();
        }
    });

    el.prevBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        prevMatch();
    });

    el.nextBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        nextMatch();
    });

    el.closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeFindReplace();
    });

    el.replaceBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        replaceCurrentMatch();
    });

    el.replaceAllBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        replaceAllMatches();
    });

    // Botón en la barra de herramientas
    document.getElementById('findReplaceBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isOpen) {
            closeFindReplace();
        } else {
            openFindReplace('find');
        }
    });
}
