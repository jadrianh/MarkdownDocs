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

    parseMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' class='text-blue-500 hover:underline' target='_blank'>$1</a>")
            .replace(/\n/gim, '<br />');
    }
};