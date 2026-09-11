import { renderMarkdownPage } from '../pages/MarkdownPage.js';

/**
 * Markdown Flavor Section Template (Backward compatibility wrapper)
 * @param {string} [activeFlavor='gfm'] - Active markdown flavor
 * @returns {string} HTML markup string
 */
export function renderMarkdownFlavorSection(activeFlavor = 'gfm') {
    return renderMarkdownPage(activeFlavor);
}
