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

        const newText = text.substring(0, start) + prefix + selection + suffix + text.substring(end);
        textarea.value = newText;
        textarea.selectionStart = start;
        textarea.selectionEnd = end + prefix.length + suffix.length;
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
            const clean = line.replace(/^(\- |\* |\d+\. )/, ''); 
            return listType === 'ordered' ? `${counter++}. ${clean}` : `- ${clean}`;
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

    downloadMarkdown(content, customFilename) {
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

        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        return filename;
    },

    parseMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            .replace(/~~(.*?)~~/gim, '<del>$1</del>')
            .replace(/`([^`]+)`/gim, '<code class="bg-zinc-200 dark:bg-zinc-700 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            .replace(/^(?:&gt;|>)\s?(.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-2 text-zinc-600 dark:text-zinc-400">$1</blockquote>')
            .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-primary hover:underline' target='_blank'>$1</a>")
            .replace(/\n/gim, '<br />');
    }
};