import { ParserManager } from './parser.manager.js';
import { ToastView } from '../../ui/toast.view.js';
import { closeAllDropdowns } from '../../ui/dropdown.util.js';

const FLAVOR_METADATA = {
    gfm: {
        label: 'GFM',
        icon: 'terminal',
        fullName: 'GitHub (GFM)'
    },
    academic: {
        label: 'ACAD',
        icon: 'functions',
        fullName: 'Académico (LaTeX)'
    },
    commonmark: {
        label: 'STD',
        icon: 'check_circle',
        fullName: 'CommonMark'
    }
};

export function initParserController() {
    // 1. Sincronizar estado inicial
    syncParserUI(ParserManager.getActiveProfileId());

    // 2. Suscribirse a cambios de perfil
    ParserManager.subscribe((profile) => {
        syncParserUI(profile.id);
    });

    // 3. Escuchadores para la barra de herramientas (selector rápido)
    document.querySelectorAll('.dropdown-flavor-item').forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const flavor = item.dataset.flavor;
            if (!flavor) return;

            const changed = ParserManager.setProfile(flavor);
            if (changed) {
                const meta = FLAVOR_METADATA[flavor];
                ToastView.show(`Dialecto: ${meta?.fullName || flavor}`, 'info');
            }
            closeAllDropdowns();
        });
    });

    // 4. Escuchadores para las tarjetas del modal de preferencias
    document.querySelectorAll('.flavor-option-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const flavor = btn.dataset.flavor;
            if (!flavor) return;

            const changed = ParserManager.setProfile(flavor);
            if (changed) {
                const meta = FLAVOR_METADATA[flavor];
                ToastView.show(`Dialecto: ${meta?.fullName || flavor}`, 'info');
            }
        });
    });
}

export function syncParserUI(activeFlavor) {
    const meta = FLAVOR_METADATA[activeFlavor] || FLAVOR_METADATA.gfm;

    // Actualizar botón de la barra de herramientas
    const flavorText = document.getElementById('currentFlavorText');
    const flavorIcon = document.getElementById('currentFlavorIcon');
    const flavorBtn = document.getElementById('btnMarkdownFlavor');

    if (flavorText) flavorText.textContent = meta.label;
    if (flavorIcon) flavorIcon.textContent = meta.icon;
    if (flavorBtn) flavorBtn.title = `Dialecto Markdown: ${meta.fullName}`;

    // Actualizar checkmarks en el menú desplegable
    document.querySelectorAll('.dropdown-flavor-item').forEach((item) => {
        const isSelected = item.dataset.flavor === activeFlavor;
        item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        const check = item.querySelector('.flavor-check');
        if (check) {
            check.classList.toggle('opacity-0', !isSelected);
        }
    });

    // Actualizar tarjetas en el modal de preferencias
    document.querySelectorAll('.flavor-option-btn').forEach((btn) => {
        const isSelected = btn.dataset.flavor === activeFlavor;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });
}
