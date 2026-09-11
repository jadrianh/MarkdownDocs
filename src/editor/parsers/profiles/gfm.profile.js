import { Marked } from 'marked';
import { highlightCode } from '../common/codeHighlight.js';
import { transformGithubAlerts } from '../common/githubAlerts.js';

const gfmInstance = new Marked({
    gfm: true,
    breaks: true,
    pedantic: false,
    renderer: {
        link({ href, title, text }) {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${text}</a>`;
        },
        code({ text, lang }) {
            return highlightCode(text, lang);
        },
        listitem(item) {
            if (item.task) {
                const itemText = this.parser.parse(item.tokens, !!item.loose);
                return `<li class="task-list-item my-1 list-none flex items-center">${itemText}</li>\n`;
            }
            return false;
        },
        checkbox({ checked }) {
            const isChecked = checked ? 'checked' : '';
            return `<input type="checkbox" ${isChecked} disabled class="mr-2 accent-primary rounded cursor-default align-middle" /> `;
        }
    }
});

export const gfmProfile = {
    id: 'gfm',
    name: 'GitHub Flavored Markdown',
    shortName: 'GitHub GFM',
    description: 'Estándar para desarrolladores: tablas, listas de tareas, alertas callout y saltos automáticos.',
    badge: 'Predeterminado',

    parse(markdownText) {
        const rawHtml = gfmInstance.parse(markdownText);
        const htmlString = typeof rawHtml === 'string' ? rawHtml : String(rawHtml || '');
        return transformGithubAlerts(htmlString);
    }
};
