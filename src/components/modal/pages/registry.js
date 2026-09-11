import { renderAppearancePage } from './AppearancePage.js';
import { renderTypographyPage } from './TypographyPage.js';
import { renderMarkdownPage } from './MarkdownPage.js';
import { renderAboutPage } from './AboutPage.js';

/**
 * Preferences Page Registry Definition
 * Central declarative registry enabling scalable and modular page addition in the future.
 * Each entry provides identity, visual representation, and template render function.
 */
export const PREFERENCES_PAGES = [
    {
        id: 'appearance',
        label: 'Apariencia',
        icon: 'palette',
        category: 'Visual',
        description: 'Personaliza el tema cromático de la interfaz y el color de acento principal.',
        render: () => renderAppearancePage()
    },
    {
        id: 'typography',
        label: 'Tipografía',
        icon: 'text_fields',
        category: 'Editor',
        description: 'Ajusta la fuente y escala de texto para el editor de código y la vista previa.',
        render: () => renderTypographyPage()
    },
    {
        id: 'markdown',
        label: 'Markdown',
        icon: 'integration_instructions',
        category: 'Motor',
        description: 'Configura las extensiones de sintaxis y dialectos del motor de renderizado.',
        render: (options = {}) => renderMarkdownPage(options.activeFlavor || 'gfm')
    },
    {
        id: 'about',
        label: 'Acerca de',
        icon: 'info',
        category: 'General',
        description: 'Atajos de teclado rápidos e información general del sistema.',
        render: () => renderAboutPage()
    }
];

/**
 * Helper to get a page definition by ID
 * @param {string} id - Page identifier
 * @returns {Object|undefined} Page definition
 */
export function getPreferencesPage(id) {
    return PREFERENCES_PAGES.find(page => page.id === id);
}
