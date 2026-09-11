import { Marked } from 'marked';
import { highlightCode } from '../common/codeHighlight.js';

const commonmarkInstance = new Marked({
    gfm: false,
    breaks: false,
    pedantic: false,
    renderer: {
        link({ href, title, text }) {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${text}</a>`;
        },
        code({ text, lang }) {
            return highlightCode(text, lang);
        }
    }
});

export const commonmarkProfile = {
    id: 'commonmark',
    name: 'CommonMark Estricto',
    shortName: 'CommonMark',
    description: 'Especificación estándar y universal sin extensiones propietarias (máxima portabilidad).',
    badge: 'Universal',

    parse(markdownText) {
        const rawHtml = commonmarkInstance.parse(markdownText);
        return typeof rawHtml === 'string' ? rawHtml : String(rawHtml || '');
    }
};
