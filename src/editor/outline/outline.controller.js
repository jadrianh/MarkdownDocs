import { state } from '../../core/state.js';
import { extractHeadings, navigateToHeadingInEditor, navigateToHeadingInPreview } from './outline.service.js';
import { OutlineView } from './outline.view.js';
import { GrammarView } from '../../api/grammar/grammar.view.js';

let currentHeadings = [];
let updateDebounceTimer = null;

export function refreshOutline() {
    const editor = document.getElementById('editor');
    if (!editor) return;

    currentHeadings = extractHeadings(editor.value);
    OutlineView.render(currentHeadings);
}

export function openOutlineTab() {
    // Si el panel lateral está cerrado, abrirlo
    if (!state.isSidebarOpen) {
        state.setSidebarOpen(true);
        GrammarView.updateSidebarUI(true);
    }
    OutlineView.switchTab('outline');
    refreshOutline();
}

export function toggleOutlineTab() {
    if (!state.isSidebarOpen) {
        openOutlineTab();
    } else if (OutlineView.activeTab === 'outline') {
        OutlineView.switchTab('suggestions');
    } else {
        openOutlineTab();
    }
}

export function initOutlineController() {
    const editor = document.getElementById('editor');
    const outlinePanel = document.getElementById('outlinePanel');
    const previewPanel = document.getElementById('previewPanel');
    const tabSuggestionsBtn = document.getElementById('tabSuggestionsBtn');
    const tabOutlineBtn = document.getElementById('tabOutlineBtn');
    const toggleOutlineBtn = document.getElementById('toggleOutlineBtn');

    // Inicializar vista del esquema
    OutlineView.init();
    refreshOutline();

    // Actualizar encabezados al editar texto (con micro-debounce)
    editor?.addEventListener('input', () => {
        if (updateDebounceTimer) clearTimeout(updateDebounceTimer);
        updateDebounceTimer = setTimeout(() => {
            refreshOutline();
            updateDebounceTimer = null;
        }, 150);
    });

    // Clic en pestaña Sugerencias
    tabSuggestionsBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        OutlineView.switchTab('suggestions');
    });

    // Clic en pestaña Estructura
    tabOutlineBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        openOutlineTab();
    });

    // Botón en la barra de herramientas para alternar esquema
    toggleOutlineBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleOutlineTab();
    });

    // Clic en un elemento del esquema para navegar
    outlinePanel?.addEventListener('click', (e) => {
        const item = e.target.closest('.outline-heading-item');
        if (!item) return;

        const headingIndex = parseInt(item.dataset.headingIndex, 10);
        const heading = currentHeadings[headingIndex];
        if (!heading) return;

        // 1. Navegar en el editor si está visible
        if (state.viewMode === 'editor' || state.viewMode === 'split') {
            navigateToHeadingInEditor(editor, heading);
        }

        // 2. Navegar en la vista previa si está visible
        if (state.viewMode === 'preview' || state.viewMode === 'split') {
            navigateToHeadingInPreview(previewPanel, headingIndex, heading.slug);
        }

        // 3. En pantallas móviles, cerrar el panel lateral tras seleccionar la sección
        if (window.innerWidth < 768) {
            state.setSidebarOpen(false);
            GrammarView.updateSidebarUI(false);
        }
    });

    // Atajo global de teclado (Ctrl+Shift+O o Cmd+Shift+O) para alternar el esquema
    document.addEventListener('keydown', (e) => {
        const isCtrlOrCmd = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;
        const isAlt = e.altKey;
        const key = e.key ? e.key.toLowerCase() : '';

        if (isCtrlOrCmd && isShift && !isAlt && (key === 'o' || e.code === 'KeyO')) {
            e.preventDefault();
            toggleOutlineTab();
        }
    });
}
