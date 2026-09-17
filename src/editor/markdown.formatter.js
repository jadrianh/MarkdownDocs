/**
 * Markdown Document Auto-Formatter
 *
 * Normalizes document structure, collapses excessive whitespace,
 * formats and aligns GFM tables, cleans up lists, tasks, headings,
 * blockquotes, and dividers while strictly preserving code blocks and math expressions.
 */

export function formatMarkdown(content) {
    if (!content || typeof content !== 'string') return '';
    if (!content.trim()) return '';

    const lines = content.split(/\r?\n/);
    const resultLines = [];

    let inCodeBlock = false;
    let codeBlockFenceChar = '';
    let inMathBlock = false;

    let i = 0;
    while (i < lines.length) {
        const rawLine = lines[i];

        // 1. Code block boundary check (``` or ~~~)
        const codeFenceOpenMatch = rawLine.match(/^([ \t]*)(`{3,}|~{3,})/);
        if (!inCodeBlock && codeFenceOpenMatch) {
            inCodeBlock = true;
            codeBlockFenceChar = codeFenceOpenMatch[2][0];
            resultLines.push(rawLine.trimEnd());
            i++;
            continue;
        } else if (inCodeBlock) {
            // Check for closing fence (matching fence char, at least 3, no content after)
            const closeRegex = new RegExp(`^[ \\t]*${codeBlockFenceChar}{3,}[ \\t]*$`);
            if (closeRegex.test(rawLine)) {
                inCodeBlock = false;
                codeBlockFenceChar = '';
                resultLines.push(rawLine.trimEnd());
                i++;
                continue;
            }
            // Inside code block: preserve exactly as authored
            resultLines.push(rawLine);
            i++;
            continue;
        }

        // 2. Math block boundary check ($$)
        if (rawLine.trim() === '$$') {
            inMathBlock = !inMathBlock;
            resultLines.push('$$');
            i++;
            continue;
        }

        if (inMathBlock) {
            // Inside math block: preserve line
            resultLines.push(rawLine);
            i++;
            continue;
        }

        // 3. GFM Table detection and formatting
        if (isTableStart(lines, i)) {
            const tableLines = [];
            while (i < lines.length && isTableRow(lines[i])) {
                tableLines.push(lines[i]);
                i++;
            }
            const formattedTable = formatTable(tableLines);
            resultLines.push(...formattedTable);
            continue;
        }

        let line = rawLine;

        // 4. Trailing whitespace handling
        // Preserve exactly two spaces if used for Markdown hard linebreak, else trim
        if (/\S  $/.test(line)) {
            line = line.replace(/[ \t]+$/, '  ');
        } else {
            line = line.replace(/[ \t]+$/, '');
        }

        // Blank lines
        if (/^\s*$/.test(line)) {
            resultLines.push('');
            i++;
            continue;
        }

        // 5. Horizontal rules (---, ***, ___)
        if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
            resultLines.push('---');
            i++;
            continue;
        }

        // 6. Headings (# Title)
        if (/^#{1,6}(?:\s.*|\S.*)?$/.test(line.trimStart())) {
            line = line.trimStart();
            line = line.replace(/^(#{1,6})[ \t]*(.*?)$/, (m, hashes, text) => {
                // Strip optional trailing closing hashes (e.g. ### Header ###)
                const cleanedText = text.replace(/\s*#+$/, '').trim();
                return cleanedText ? `${hashes} ${cleanedText}` : hashes;
            });
            resultLines.push(line);
            i++;
            continue;
        }

        // 7. Blockquotes (> Quote)
        if (/^\s*>/.test(line)) {
            line = line.replace(/^(\s*>+)[ \t]*(.*)$/, (m, arrows, text) => {
                const trimmedText = text.trimStart();
                return trimmedText ? `${arrows} ${trimmedText}` : arrows;
            });
            resultLines.push(line);
            i++;
            continue;
        }

        // 8. Task lists (- [ ] or - [x])
        const taskMatch = line.match(/^(\s*)([-*+])\s*\[([ xX])\]\s*(.*)$/);
        if (taskMatch) {
            const indent = taskMatch[1];
            const check = taskMatch[3].toLowerCase() === 'x' ? 'x' : ' ';
            const itemText = taskMatch[4].trim();
            resultLines.push(`${indent}- [${check}] ${itemText}`);
            i++;
            continue;
        }

        // 9. Unordered lists: normalize bullets to '-' and ensure uniform spacing
        const bulletMatch = line.match(/^(\s*)([-*+])\s+(.*)$/);
        if (bulletMatch) {
            const indent = bulletMatch[1];
            const itemText = bulletMatch[3].trim();
            resultLines.push(`${indent}- ${itemText}`);
            i++;
            continue;
        }

        // 10. Ordered lists (1. Item)
        const orderedMatch = line.match(/^(\s*)(\d+)\.\s*(.*)$/);
        if (orderedMatch) {
            const indent = orderedMatch[1];
            const num = orderedMatch[2];
            const itemText = orderedMatch[3].trim();
            resultLines.push(`${indent}${num}. ${itemText}`);
            i++;
            continue;
        }

        resultLines.push(line);
        i++;
    }

    // Renumber consecutive ordered list sequences at same indentation level
    renumberOrderedLists(resultLines);

    // Structure blank lines around headings, dividers, tables, and collapse excessive blanks
    return cleanDocumentSpacing(resultLines);
}

function isTableStart(lines, index) {
    if (index + 1 >= lines.length) return false;
    const line1 = lines[index].trim();
    const line2 = lines[index + 1].trim();

    if (!line1.includes('|')) return false;
    // Check if line 2 is a separator row: e.g. | --- | :---: | ---: |
    return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line2);
}

function isTableRow(line) {
    const trimmed = line.trim();
    return trimmed.length > 0 && trimmed.includes('|');
}

function formatTable(rows) {
    if (rows.length < 2) return rows;

    const parsedRows = rows.map(r => {
        let trimmed = r.trim();
        if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
        if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
        return trimmed.split('|').map(cell => cell.trim());
    });

    const colCount = Math.max(...parsedRows.map(r => r.length));

    // Parse column alignment from separator row (index 1)
    const alignments = [];
    const sepRow = parsedRows[1] || [];
    for (let c = 0; c < colCount; c++) {
        const sepCell = sepRow[c] || '';
        const leftColon = sepCell.startsWith(':');
        const rightColon = sepCell.endsWith(':');
        if (leftColon && rightColon) alignments.push('center');
        else if (rightColon) alignments.push('right');
        else if (leftColon) alignments.push('left');
        else alignments.push('default');
    }

    // Measure maximum width per column
    const colWidths = new Array(colCount).fill(3);
    for (let r = 0; r < parsedRows.length; r++) {
        if (r === 1) continue; // Skip separator for content width calculation
        for (let c = 0; c < colCount; c++) {
            const cellLen = (parsedRows[r][c] || '').length;
            if (cellLen > colWidths[c]) {
                colWidths[c] = cellLen;
            }
        }
    }

    const outputRows = [];

    // 1. Header row
    outputRows.push(formatTableRow(parsedRows[0] || [], colWidths, alignments));

    // 2. Separator row
    const sepCells = [];
    for (let c = 0; c < colCount; c++) {
        const width = colWidths[c];
        const align = alignments[c];
        if (align === 'center') {
            sepCells.push(':' + '-'.repeat(Math.max(1, width - 2)) + ':');
        } else if (align === 'right') {
            sepCells.push('-'.repeat(Math.max(2, width - 1)) + ':');
        } else if (align === 'left') {
            sepCells.push(':' + '-'.repeat(Math.max(2, width - 1)));
        } else {
            sepCells.push('-'.repeat(Math.max(3, width)));
        }
    }
    outputRows.push(`| ${sepCells.join(' | ')} |`);

    // 3. Data rows
    for (let r = 2; r < parsedRows.length; r++) {
        outputRows.push(formatTableRow(parsedRows[r] || [], colWidths, alignments));
    }

    return outputRows;
}

function formatTableRow(cells, colWidths, alignments) {
    const formattedCells = [];
    for (let c = 0; c < colWidths.length; c++) {
        const text = cells[c] || '';
        const width = colWidths[c];
        const align = alignments[c];

        if (align === 'right') {
            formattedCells.push(text.padStart(width, ' '));
        } else if (align === 'center') {
            const totalPad = width - text.length;
            const leftPad = Math.floor(totalPad / 2);
            const rightPad = totalPad - leftPad;
            formattedCells.push(' '.repeat(leftPad) + text + ' '.repeat(rightPad));
        } else {
            formattedCells.push(text.padEnd(width, ' '));
        }
    }
    return `| ${formattedCells.join(' | ')} |`;
}

function renumberOrderedLists(lines) {
    let currentListIndent = null;
    let expectedNumber = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^([ \t]*)(\d+)\.\s+(.*)$/);

        if (match) {
            const indent = match[1];
            const text = match[3];

            if (currentListIndent === null || currentListIndent !== indent) {
                currentListIndent = indent;
                expectedNumber = 1;
            }

            lines[i] = `${indent}${expectedNumber}. ${text}`;
            expectedNumber++;
        } else {
            if (line.trim().length === 0) {
                if (i + 1 < lines.length && !lines[i + 1].match(/^[ \t]*\d+\.\s+/)) {
                    currentListIndent = null;
                }
            } else if (!line.startsWith(currentListIndent + '  ')) {
                currentListIndent = null;
            }
        }
    }
}

function cleanDocumentSpacing(lines) {
    const spaced = [];
    let inCode = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
            inCode = !inCode;
        }

        if (inCode) {
            spaced.push(line);
            continue;
        }

        const isHeader = /^#{1,6}\s/.test(line);
        const isDivider = line === '---';
        const isTable = line.startsWith('| ') && line.endsWith(' |');
        const prevLine = spaced.length > 0 ? spaced[spaced.length - 1] : null;

        // Ensure blank line before header, divider, or table
        if ((isHeader || isDivider || isTable) && prevLine !== null && prevLine !== '' && !prevLine.startsWith('|') && !(isHeader && /^#{1,6}\s/.test(prevLine))) {
            spaced.push('');
        }

        // Collapse consecutive blank lines
        if (line === '' && prevLine === '') {
            continue;
        }

        spaced.push(line);

        // Ensure blank line after header or divider if next line exists and isn't blank/header
        if ((isHeader || isDivider) && i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            if (nextLine !== '' && !/^#{1,6}\s/.test(nextLine)) {
                spaced.push('');
            }
        }
    }

    // Trim leading blank lines
    while (spaced.length > 0 && spaced[0] === '') {
        spaced.shift();
    }

    // Trim trailing blank lines
    while (spaced.length > 0 && spaced[spaced.length - 1] === '') {
        spaced.pop();
    }

    if (spaced.length === 0) return '';
    return spaced.join('\n') + '\n';
}
