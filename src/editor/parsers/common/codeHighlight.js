import Prism from 'prismjs';

// Gramáticas comunes de Prism para resaltado en bloques de código
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/components/prism-tsx.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-markdown.js';
import 'prismjs/components/prism-sql.js';
import 'prismjs/components/prism-css.js';

/**
 * Resalta un bloque de código usando Prism.js con escape defensivo de caracteres HTML.
 *
 * @param {string} text - Contenido en texto plano del bloque de código
 * @param {string} [lang] - Identificador del lenguaje (ej. 'javascript', 'python')
 * @returns {string} HTML del bloque <pre><code> resaltado
 */
export function highlightCode(text, lang) {
    const validLang = lang && Prism.languages[lang] ? lang : null;
    let highlighted;

    if (validLang) {
        try {
            highlighted = Prism.highlight(text, Prism.languages[validLang], validLang);
        } catch {
            highlighted = escapeHtml(text);
        }
    } else {
        highlighted = escapeHtml(text);
    }

    const langClass = validLang ? ` language-${validLang}` : '';
    return `<pre class="custom-scrollbar bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-xs"><code class="${langClass}">${highlighted}</code></pre>`;
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
