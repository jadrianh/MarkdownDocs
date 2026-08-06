import { Marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import Prism from 'prismjs';

const markedInstance = new Marked();

markedInstance.use(
    markedKatex({
        throwOnError: false,
        nonStandard: true
    })
);

// Sanitizador simple para evitar renderizado desinfectando etiquetas HTML directas o no permitidas
function sanitizeHtml(html) {
    return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, (match) => {
        return match.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    });
}

markedInstance.use({
    gfm: true,
    pedantic: false,
    breaks: true,
    renderer: {
        link({ href, title, text }) {
            const titleAttr = title ? ` title="${title}"` : '';
            return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${text}</a>`;
        },
        code({ text, lang }) {
            const validLang = lang && Prism.languages[lang] ? lang : null;
            let highlighted;
            if (validLang) {
                try {
                    highlighted = Prism.highlight(text, Prism.languages[validLang], validLang);
                } catch {
                    highlighted = text;
                }
            } else {
                highlighted = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
            const langClass = validLang ? ` language-${validLang}` : '';
            return `<pre class="custom-scrollbar bg-zinc-900 text-zinc-100 p-4 rounded-lg overflow-x-auto my-4 font-mono text-xs"><code class="${langClass}">${highlighted}</code></pre>`;
        },
        listitem(item) {
            if (item.task) {
                const itemText = this.parser.parse(item.tokens, !!item.loose);
                return `<li class="task-list-item my-1 list-none flex items-center">${itemText}</li>\n`;
            }
            return false; // Retorna false para que Marked use su renderer nativo optimizado para listas normales y anidadas
        },
        checkbox({ checked }) {
            const isChecked = checked ? 'checked' : '';
            return `<input type="checkbox" ${isChecked} disabled class="mr-2 accent-primary rounded cursor-default align-middle" /> `;
        }
    }
});

export const EditorService = {
    toggleStyle(textarea, prefix, suffix) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        if (!selection) {
            const newText = text.substring(0, start) + prefix + suffix + text.substring(end);
            textarea.value = newText;
            textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
            return newText;
        }

        // Separar espacios iniciales y finales para colocar los símbolos envolviendo únicamente el texto
        const leadingWhitespaceMatch = selection.match(/^\s*/);
        const trailingWhitespaceMatch = selection.match(/\s*$/);

        const leadingWs = leadingWhitespaceMatch ? leadingWhitespaceMatch[0] : '';
        const trailingWs = trailingWhitespaceMatch ? trailingWhitespaceMatch[0] : '';

        // Si la selección son solo espacios en blanco
        if (leadingWs.length === selection.length) {
            const newText = text.substring(0, start) + prefix + suffix + selection + text.substring(end);
            textarea.value = newText;
            textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
            return newText;
        }

        const trimmedSelection = selection.substring(leadingWs.length, selection.length - trailingWs.length);

        // Verificar si ya está formateado (para quitar el estilo al volver a hacer clic)
        const isFormatted = trimmedSelection.startsWith(prefix) && trimmedSelection.endsWith(suffix) && trimmedSelection.length >= prefix.length + suffix.length;

        let formattedCore;
        if (isFormatted) {
            formattedCore = trimmedSelection.substring(prefix.length, trimmedSelection.length - suffix.length);
        } else {
            formattedCore = prefix + trimmedSelection + suffix;
        }

        const replacement = leadingWs + formattedCore + trailingWs;
        const newText = text.substring(0, start) + replacement + text.substring(end);
        
        textarea.value = newText;
        textarea.selectionStart = start + leadingWs.length;
        textarea.selectionEnd = start + leadingWs.length + formattedCore.length;

        return newText;
    },

    applyHeader(textarea, level = 0) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        let lineStart = text.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = text.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = text.length;

        const selectedLine = text.substring(lineStart, lineEnd);
        const cleanLine = selectedLine.replace(/^#{1,6}\s*/, '');

        let prefix = '';
        if (level === 1) prefix = '# ';
        else if (level === 2) prefix = '## ';
        else if (level === 3) prefix = '### ';

        const newLine = prefix + cleanLine;
        const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd);

        textarea.value = newText;
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + newLine.length;

        return newText;
    },

    clearFormatting(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        if (start === end) return text;

        const selection = text.substring(start, end);
        const cleaned = selection
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/~~(.*?)~~/g, '$1')
            .replace(/`([^`\n]+)`/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/_(.*?)_/g, '$1');

        const newText = text.substring(0, start) + cleaned + text.substring(end);
        textarea.value = newText;
        textarea.selectionStart = start;
        textarea.selectionEnd = start + cleaned.length;

        return newText;
    },

    makeList(textarea, listType = 'unordered') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        let lineStart = text.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = text.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = text.length;

        const selectedText = text.substring(lineStart, lineEnd);
        const lines = selectedText.split('\n');
        let counter = 1;

        const newLines = lines.map((line) => {
            if (line.trim().length === 0) return line;
            
            const leadingWsMatch = line.match(/^\s*/);
            const leadingWs = leadingWsMatch ? leadingWsMatch[0] : '';
            const lineWithoutIndent = line.substring(leadingWs.length);

            const clean = lineWithoutIndent.replace(/^(- |\* |\d+\. )/, ''); 
            const prefix = listType === 'ordered' ? `${counter++}. ` : '- ';

            return `${leadingWs}${prefix}${clean}`;
        });

        const newBlock = newLines.join('\n');
        const newText = text.substring(0, lineStart) + newBlock + text.substring(lineEnd);
        
        textarea.value = newText;
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + newBlock.length;
        
        return newText;
    },

    insertLink(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const linkText = selection || 'texto';
        const linkMD = `[${linkText}](https://)`;

        const newText = text.substring(0, start) + linkMD + text.substring(end);
        textarea.value = newText;
        
        if (selection) {
            const urlStart = start + selection.length + 3;
            textarea.selectionStart = urlStart;
            textarea.selectionEnd = urlStart + 8;
        } else {
            textarea.selectionStart = start + 1;
            textarea.selectionEnd = start + 1 + linkText.length;
        }

        return newText;
    },

    insertCodeBlock(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const codeBlock = selection ? `\`\`\`\n${selection}\n\`\`\`` : `\`\`\`\n// Código aquí\n\`\`\``;

        const newText = text.substring(0, start) + codeBlock + text.substring(end);
        textarea.value = newText;

        if (!selection) {
            textarea.selectionStart = start + 4;
            textarea.selectionEnd = start + 17;
        } else {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + codeBlock.length;
        }

        return newText;
    },

    insertQuote(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        let lineStart = text.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = text.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = text.length;

        const selectedText = text.substring(lineStart, lineEnd);
        const lines = selectedText.split('\n');

        const newLines = lines.map(line => {
            if (line.startsWith('> ')) {
                return line.substring(2);
            }
            return `> ${line}`;
        });

        const newBlock = newLines.join('\n');
        const newText = text.substring(0, lineStart) + newBlock + text.substring(lineEnd);

        textarea.value = newText;
        textarea.selectionStart = lineStart;
        textarea.selectionEnd = lineStart + newBlock.length;

        return newText;
    },

    async downloadMarkdown(content, customFilename) {
        let filename = customFilename;
        if (!filename) {
            const h1Match = content.match(/^#\s+(.+)$/m);
            if (h1Match && h1Match[1].trim()) {
                filename = h1Match[1].trim().toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-').replace(/(^-|-$)/g, '') + '.md';
            } else {
                filename = 'documento.md';
            }
        }
        if (!filename.endsWith('.md')) filename += '.md';

        // Intentar usar la API nativa de Selección de Archivo del Sistema Operativo
        if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
            try {
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{
                        description: 'Archivo Markdown',
                        accept: {
                            'text/markdown': ['.md', '.markdown'],
                            'text/plain': ['.md', '.txt']
                        }
                    }]
                });
                const writable = await handle.createWritable();
                await writable.write(content);
                await writable.close();
                return handle.name;
            } catch (err) {
                // El usuario hizo clic en Cancelar o cerró la ventana de Windows "Guardar como"
                if (err.name === 'AbortError') {
                    return null;
                }
                console.error("Error al usar showSaveFilePicker:", err);
            }
        }

        // Fallback mediante iframe para abrir la ventana de guardar si no hay File System Access API
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        
        return filename;
    },

    downloadPdf(content, previewElement) {
        let title = 'documento';
        const h1Match = content.match(/^#\s+(.+)$/m);
        if (h1Match && h1Match[1].trim()) {
            title = h1Match[1].trim();
        }

        const previewHTML = previewElement ? previewElement.innerHTML : this.parseMarkdown(content);
        const previewFontFamily = previewElement ? window.getComputedStyle(previewElement).fontFamily : "'Hanken Grotesk', sans-serif";
        const previewFontSize = previewElement ? window.getComputedStyle(previewElement).fontSize : '15px';

        const printWindow = window.open('', '_blank');
        if (!printWindow) return false;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Merriweather:wght@400;700&family=Lato:wght@400;700&family=Source+Code+Pro:wght@400;500&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
                <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
                <style>
                    body {
                        font-family: ${previewFontFamily};
                        font-size: ${previewFontSize};
                        padding: 2rem;
                        background: #ffffff;
                        color: #18181b;
                    }
                    @page {
                        margin: 20mm;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body class="prose max-w-none">
                <div>${previewHTML}</div>
                <script>
                    window.onload = () => {
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 250);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        return title;
    },

    parseMarkdown(text) {
        if (!text) return '';
        try {
            // Reemplazar tabulaciones por 2 espacios de forma consistente para evitar desalineación del AST de listas
            const sanitizedInput = text.replace(/\t/g, '  ');
            const rawHtml = markedInstance.parse(sanitizedInput);
            const htmlString = typeof rawHtml === 'string' ? rawHtml : (rawHtml && rawHtml.then ? text : String(rawHtml));
            return sanitizeHtml(htmlString);
        } catch (err) {
            console.error("Error al procesar la sintaxis de Markdown:", err, "\nTexto de entrada que falló:", text);
            return `
                <div class="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-700 dark:text-red-300 font-sans text-xs flex items-center gap-3">
                    <span class="material-symbols-outlined text-[20px] text-red-500">warning</span>
                    <div>
                        <p class="font-semibold">Error al renderizar el documento</p>
                        <p class="opacity-80">Por favor revisa la sintaxis del texto o los bloques de código.</p>
                    </div>
                </div>
            `;
        }
    }
};