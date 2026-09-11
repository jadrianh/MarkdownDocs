import DOMPurify from 'dompurify';

/**
 * Sanitiza HTML generado por cualquier parser de Markdown usando DOMPurify.
 * Previene vectores XSS mientras preserva etiquetas necesarias para listas de tareas
 * y atributos seguros de enlaces.
 *
 * @param {string} html - HTML sin sanitizar
 * @returns {string} HTML sanitizado y seguro
 */
export function sanitizeHtml(html) {
    if (!html) return '';

    const purify = DOMPurify?.sanitize
        ? DOMPurify
        : (typeof DOMPurify === 'function' && typeof window !== 'undefined' ? DOMPurify(window) : null);

    if (purify?.sanitize) {
        return purify.sanitize(html, {
            ADD_TAGS: ['input', 'svg', 'path'], // necesario para checkboxes de tareas y Octicons de alertas GFM
            ADD_ATTR: ['checked', 'disabled', 'target', 'rel', 'viewBox', 'version', 'aria-hidden', 'fill', 'd', 'dir']
        });
    }

    return html;
}
