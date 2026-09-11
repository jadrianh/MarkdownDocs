/**
 * Utilidades para menús desplegables con soporte completo para WAI-ARIA
 * y navegación por teclado accesible (Escape, Flechas Arriba/Abajo, Home, End).
 */
export function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach((menu) => {
        menu.classList.add('hidden');
    });
    document.querySelectorAll('.dropdown-trigger').forEach((trigger) => {
        trigger.setAttribute('aria-expanded', 'false');
    });
}

export function toggleDropdown(trigger) {
    const container = trigger.closest('.dropdown-container');
    const menu = container?.querySelector('.dropdown-menu');
    if (!menu) return;

    const isCurrentlyHidden = menu.classList.contains('hidden');

    // Cerrar todos los menús abiertos antes de abrir el actual
    closeAllDropdowns();

    if (isCurrentlyHidden) {
        menu.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');

        // Enfocar el primer elemento del menú para navegación por teclado
        const firstItem = menu.querySelector('button, [role="menuitem"], [role="option"]');
        if (firstItem && document.activeElement === trigger) {
            // Dejar el foco en el disparador si fue clic con ratón, pero preparar navegación
        }
    } else {
        menu.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
    }
}

export function setupDropdownKeyboardNav() {
    document.querySelectorAll('.dropdown-container').forEach(container => {
        const trigger = container.querySelector('.dropdown-trigger');
        const menu = container.querySelector('.dropdown-menu');

        container.addEventListener('keydown', (e) => {
            const isMenuOpen = menu && !menu.classList.contains('hidden');

            // Escape: cerrar menú y devolver foco al disparador
            if (e.key === 'Escape' && isMenuOpen) {
                e.preventDefault();
                e.stopPropagation();
                closeAllDropdowns();
                trigger?.focus();
                return;
            }

            // Si el menú está cerrado y el disparador tiene foco, abrirlo con flecha abajo
            if (!isMenuOpen) {
                if (e.key === 'ArrowDown' && document.activeElement === trigger) {
                    e.preventDefault();
                    toggleDropdown(trigger);
                    const firstItem = menu?.querySelector('button, [role="menuitem"], [role="option"]');
                    firstItem?.focus();
                }
                return;
            }

            // Si el menú está abierto, navegar entre sus elementos
            const items = Array.from(menu.querySelectorAll('button:not([disabled]), [role="menuitem"], [role="option"]'));
            if (items.length === 0) return;

            const currentIndex = items.indexOf(document.activeElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
                items[nextIndex]?.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
                items[prevIndex]?.focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                items[0]?.focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                items[items.length - 1]?.focus();
            } else if (e.key === 'Tab') {
                closeAllDropdowns();
            }
        });
    });
}
