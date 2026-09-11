import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import { highlightCode } from '../common/codeHighlight.js';
import { transformGithubAlerts } from '../common/githubAlerts.js';

const academicInstance = new Marked({
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

// Soporte para matemáticas con KaTeX ($inline$ y $$block$$)
academicInstance.use(
    markedKatex({
        throwOnError: false,
        nonStandard: true
    })
);

/**
 * Extrae y procesa notas al pie en formato estándar Markdown:
 * Referencia: [^1] o [^nota]
 * Definición: [^1]: Texto explicativo de la nota.
 */
function processFootnotes(text) {
    const footnoteDefs = new Map();
    let index = 1;

    // 1. Extraer definiciones al final o entre párrafos: [^id]: texto
    const defRegex = /^\[\^([^\]]+)\]:\s*([^\n]+(?:\n+(?: {4}|\t)[^\n]+)*)/gm;
    const cleanText = text.replace(defRegex, (match, id, content) => {
        if (!footnoteDefs.has(id)) {
            footnoteDefs.set(id, {
                index: index++,
                id,
                content: content.trim()
            });
        }
        return '';
    });

    if (footnoteDefs.size === 0) {
        return { text: cleanText, footnotes: [] };
    }

    // 2. Reemplazar llamadas en el cuerpo: [^id]
    const refRegex = /\[\^([^\]]+)\]/g;
    const processedText = cleanText.replace(refRegex, (match, id) => {
        const fn = footnoteDefs.get(id);
        if (!fn) return match;
        return `<sup class="footnote-ref"><a href="#fn-${fn.id}" id="fnref-${fn.id}" class="text-primary font-mono text-[10px] font-bold px-0.5 hover:underline">[${fn.index}]</a></sup>`;
    });

    return {
        text: processedText,
        footnotes: Array.from(footnoteDefs.values())
    };
}

function renderFootnotesSection(footnotes) {
    if (!footnotes || footnotes.length === 0) return '';

    const items = footnotes.map(fn => `
        <li id="fn-${fn.id}" class="relative pl-1">
            <span class="leading-relaxed">${fn.content}</span>
            <a href="#fnref-${fn.id}" class="text-primary hover:underline font-mono text-xs ml-1 inline-block" title="Volver al texto" aria-label="Volver a la referencia">↩</a>
        </li>
    `).join('');

    return `
        <section class="footnotes mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-700/80 font-mono text-xs">
            <h4 class="font-sans font-semibold text-[11px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Notas al pie</h4>
            <ol class="list-decimal pl-5 space-y-1.5 text-zinc-700 dark:text-zinc-300">
                ${items}
            </ol>
        </section>
    `;
}

export const academicProfile = {
    id: 'academic',
    name: 'Académico y Científico',
    shortName: 'Académico (LaTeX)',
    description: 'Fórmulas matemáticas KaTeX ($inline$ y $$display$$), notas al pie ([^1]) y resaltado.',
    badge: 'Científico',

    parse(markdownText) {
        const { text, footnotes } = processFootnotes(markdownText);
        const rawHtml = academicInstance.parse(text);
        const htmlString = typeof rawHtml === 'string' ? rawHtml : String(rawHtml || '');
        const alertsHtml = transformGithubAlerts(htmlString);
        const footnotesHtml = renderFootnotesSection(footnotes);

        return alertsHtml + footnotesHtml;
    }
};
