import { ParserManager } from './parsers/parser.manager.js';

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
            .replace(/_(.*?)_/g, '$1')
            .replace(/\$([^$\n]+)\$/g, '$1');

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

            const clean = lineWithoutIndent.replace(/^(- \[[ xX]\] |- |\* |\d+\. )/, ''); 
            let prefix = '- ';
            if (listType === 'ordered') {
                prefix = `${counter++}. `;
            } else if (listType === 'task') {
                prefix = '- [ ] ';
            }

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

    insertCallout(textarea, type = 'NOTE') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const alertType = (type || 'NOTE').toUpperCase();
        const placeholder = 'Escribe el contenido de la alerta aquí.';
        const contentLines = selection ? selection.split('\n') : [placeholder];
        const formattedContent = contentLines.map(line => `> ${line.replace(/^>\s*/, '')}`).join('\n');
        const calloutBlock = `> [!${alertType}]\n${formattedContent}`;

        const needsLeadingNewline = start > 0 && text[start - 1] !== '\n';
        const prefix = needsLeadingNewline ? '\n\n' : '';
        const needsTrailingNewline = end < text.length && text[end] !== '\n';
        const suffix = needsTrailingNewline ? '\n\n' : '\n';

        const fullInsertion = prefix + calloutBlock + suffix;
        const newText = text.substring(0, start) + fullInsertion + text.substring(end);

        textarea.value = newText;
        if (!selection) {
            const placeholderStart = start + prefix.length + `> [!${alertType}]\n> `.length;
            textarea.selectionStart = placeholderStart;
            textarea.selectionEnd = placeholderStart + placeholder.length;
        } else {
            textarea.selectionStart = start + prefix.length;
            textarea.selectionEnd = start + prefix.length + calloutBlock.length;
        }

        return newText;
    },

    insertTable(textarea, rows = 2, cols = 3) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const colHeaders = Array.from({ length: cols }, (_, i) => `Encabezado ${i + 1}`);
        const separator = Array.from({ length: cols }, () => '------------');
        const headerRow = `| ${colHeaders.join(' | ')} |`;
        const separatorRow = `| ${separator.join(' | ')} |`;

        const dataRows = Array.from({ length: rows }, (_, r) => {
            const cells = Array.from({ length: cols }, (_, c) => `Celda ${r * cols + c + 1}`);
            return `| ${cells.join(' | ')} |`;
        });

        const tableMD = `${headerRow}\n${separatorRow}\n${dataRows.join('\n')}`;

        const needsLeadingNewline = start > 0 && text[start - 1] !== '\n';
        const prefix = needsLeadingNewline ? '\n\n' : '';
        const needsTrailingNewline = end < text.length && text[end] !== '\n';
        const suffix = needsTrailingNewline ? '\n\n' : '\n';

        const fullInsertion = prefix + tableMD + suffix;
        const newText = text.substring(0, start) + fullInsertion + text.substring(end);

        textarea.value = newText;
        const firstHeaderStart = start + prefix.length + 2;
        textarea.selectionStart = firstHeaderStart;
        textarea.selectionEnd = firstHeaderStart + colHeaders[0].length;

        return newText;
    },

    insertMath(textarea, isBlock = false) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        if (isBlock || (selection && selection.includes('\n'))) {
            const formula = selection || 'E = mc^2';
            const blockContent = `$$\n${formula}\n$$`;
            const needsLeadingNewline = start > 0 && text[start - 1] !== '\n';
            const prefix = needsLeadingNewline ? '\n\n' : '';
            const needsTrailingNewline = end < text.length && text[end] !== '\n';
            const suffix = needsTrailingNewline ? '\n\n' : '\n';

            const fullBlock = prefix + blockContent + suffix;
            const newText = text.substring(0, start) + fullBlock + text.substring(end);
            textarea.value = newText;
            if (!selection) {
                const formulaStart = start + prefix.length + 3;
                textarea.selectionStart = formulaStart;
                textarea.selectionEnd = formulaStart + formula.length;
            } else {
                textarea.selectionStart = start + prefix.length;
                textarea.selectionEnd = start + prefix.length + blockContent.length;
            }
            return newText;
        }

        // Inline math
        return this.toggleStyle(textarea, '$', '$');
    },

    insertFootnote(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selection = text.substring(start, end);

        const existingRefs = [...text.matchAll(/\[\^(\d+)\]/g)].map(m => parseInt(m[1], 10));
        const nextIndex = existingRefs.length > 0 ? Math.max(...existingRefs) + 1 : 1;

        const refText = `[^${nextIndex}]`;
        const noteContent = selection || 'Texto explicativo de la nota.';
        const defText = `\n\n[^${nextIndex}]: ${noteContent}`;

        const textWithRef = text.substring(0, start) + refText + text.substring(end);
        const trimmed = textWithRef.trimEnd();
        const newText = trimmed + defText + '\n';

        textarea.value = newText;
        if (selection) {
            textarea.selectionStart = textarea.selectionEnd = start + refText.length;
        } else {
            const defPos = trimmed.length + `\n\n[^${nextIndex}]: `.length;
            textarea.selectionStart = defPos;
            textarea.selectionEnd = defPos + noteContent.length;
        }

        return newText;
    },

    insertDivider(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const needsLeadingNewline = start > 0 && text[start - 1] !== '\n';
        const prefix = needsLeadingNewline ? '\n\n' : '';
        const divider = `${prefix}---\n\n`;
        const newText = text.substring(0, start) + divider + text.substring(end);

        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + divider.length;

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

    /**
     * v3: ya no abre una ventana emergente que reconstruía Tailwind/KaTeX/Prism
     * desde CDN (con versiones distintas a las que ya bundleamos por npm, y
     * sujeto a que el navegador no bloquee el popup). En su lugar, imprime el
     * documento actual: el marcado real vive en #previewPanel y las reglas
     * @media print de src/style.css se encargan de mostrar solo eso y ocultar
     * el resto de la interfaz (toolbar, editor, modales, toasts).
     *
     * Requiere que #previewPanel tenga la clase `printable-area` en el HTML
     * (ver TODO en src/style.css) y que updatePreview() ya se haya llamado
     * -- editor.controller.js lo hace antes de invocar esta función.
     */
    downloadPdf(content) {
        let title = 'documento';
        const h1Match = content.match(/^#\s+(.+)$/m);
        if (h1Match && h1Match[1].trim()) {
            title = h1Match[1].trim();
        }

        const previousTitle = document.title;
        document.title = title; // varios navegadores usan document.title como nombre sugerido del PDF

        window.print();

        document.title = previousTitle;
        return title;
    },

    parseMarkdown(text) {
        return ParserManager.parse(text);
    },

    setParserProfile(profileId) {
        return ParserManager.setProfile(profileId);
    },

    getParserProfile() {
        return ParserManager.getActiveProfile();
    },

    getAvailableParserProfiles() {
        return ParserManager.getAvailableProfiles();
    }
};

export { ParserManager };