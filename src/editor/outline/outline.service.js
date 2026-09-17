/**
 * Outline Service (Estructura y Navegación de Documentos)
 * Analiza el contenido Markdown para extraer la jerarquía de encabezados (H1-H6),
 * ignorando bloques de código y bloques matemáticos para evitar falsos positivos.
 */

/**
 * Extrae los encabezados presentes en un documento Markdown.
 *
 * @param {string} markdownText - Texto Markdown a analizar.
 * @returns {Array<{ index: number, level: number, text: string, rawText: string, line: number, charOffset: number, slug: string }>}
 */
export function extractHeadings(markdownText) {
    if (!markdownText || typeof markdownText !== 'string') return [];

    const lines = markdownText.split(/\r?\n/);
    const headings = [];
    let inCodeBlock = false;
    let codeFence = '';
    let inMathBlock = false;
    let charOffset = 0;
    const slugCounts = new Map();

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        const trimmed = line.trim();

        // Detectar apertura / cierre de bloques de código delimitados por ``` o ~~~
        const fenceMatch = line.match(/^(\s*)(`{3,}|~{3,})/);
        if (fenceMatch) {
            const fenceChar = fenceMatch[2][0];
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeFence = fenceChar;
            } else if (codeFence === fenceChar) {
                inCodeBlock = false;
                codeFence = '';
            }
            charOffset += line.length + 1;
            continue;
        }

        // Detectar apertura / cierre de bloques matemáticos display ($$)
        if (trimmed === '$$') {
            inMathBlock = !inMathBlock;
            charOffset += line.length + 1;
            continue;
        }

        // Solo procesar si no nos encontramos dentro de bloques de código o matemáticas
        if (!inCodeBlock && !inMathBlock) {
            // Sintaxis ATX: entre 1 y 6 almohadillas seguidas de espacio
            const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                let rawContent = headingMatch[2].trim();

                // Eliminar almohadillas de cierre opcionales (ej: "## Título ##")
                rawContent = rawContent.replace(/\s+#+$/, '').trim();

                // Limpiar formato inline para obtener texto legible en el esquema
                const cleanText = cleanInlineMarkdown(rawContent);

                // Generar slug uniforme
                const uniqueSlug = generateSlug(cleanText || rawContent, slugCounts, headings.length);

                headings.push({
                    index: headings.length,
                    level,
                    text: cleanText || rawContent,
                    rawText: rawContent,
                    line: lineIndex,
                    charOffset,
                    slug: uniqueSlug
                });
            }
        }

        charOffset += line.length + 1; // +1 para compensar el salto de línea (\n)
    }

    return headings;
}

/**
 * Elimina sintaxis Markdown en línea para mostrar texto limpio en el árbol de navegación.
 *
 * @param {string} text
 * @returns {string}
 */
export function cleanInlineMarkdown(text) {
    if (!text) return '';
    return text
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1') // Imágenes
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // Enlaces
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Negritas
        .replace(/(\*|_)(.*?)\1/g, '$2') // Cursivas
        .replace(/~~(.*?)~~/g, '$1') // Tachado
        .replace(/`([^`]+)`/g, '$1') // Código en línea
        .replace(/\$([^$]+)\$/g, '$1') // Fórmulas en línea
        .trim();
}

/**
 * Genera un slug identificador único para navegación por anclajes.
 *
 * @param {string} text - Texto del encabezado
 * @param {Map<string, number>} slugCounts - Registro de colisiones de nombres
 * @param {number} fallbackIndex - Índice de respaldo si el texto no genera caracteres válidos
 * @returns {string}
 */
export function generateSlug(text, slugCounts, fallbackIndex = 0) {
    let slug = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos/diacríticos
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    if (!slug) {
        slug = `seccion-${fallbackIndex + 1}`;
    }

    const count = slugCounts ? (slugCounts.get(slug) || 0) : 0;
    if (slugCounts) {
        slugCounts.set(slug, count + 1);
    }

    return count === 0 ? slug : `${slug}-${count}`;
}

/**
 * Posiciona el cursor y desplaza suavemente el editor hacia el encabezado seleccionado.
 *
 * @param {HTMLTextAreaElement} editor
 * @param {{ charOffset: number, line: number }} heading
 */
export function navigateToHeadingInEditor(editor, heading) {
    if (!editor || !heading) return;

    editor.focus();
    const charPos = heading.charOffset ?? 0;
    editor.setSelectionRange(charPos, charPos);

    // Calcular desplazamiento vertical proporcional
    const textBefore = editor.value.substring(0, charPos);
    const lineIndex = textBefore.split('\n').length - 1;
    const totalLines = Math.max(1, editor.value.split('\n').length);
    const lineHeight = editor.scrollHeight / totalLines;

    // Desplazar dejando un margen superior visual cómodo (30-40px)
    const targetScrollTop = Math.max(0, lineIndex * lineHeight - 32);
    editor.scrollTop = targetScrollTop;
}

/**
 * Desplaza la vista previa hacia el encabezado objetivo y aplica una animación de pulso.
 *
 * @param {HTMLElement} previewPanel
 * @param {number} headingIndex - Índice secuencial del encabezado
 * @param {string} headingSlug - Slug identificador
 */
export function navigateToHeadingInPreview(previewPanel, headingIndex, headingSlug) {
    if (!previewPanel) return;

    let target = null;
    if (headingSlug) {
        try {
            target = previewPanel.querySelector(`#${CSS.escape(headingSlug)}`);
        } catch {
            target = null;
        }
    }

    if (!target) {
        const previewHeadings = previewPanel.querySelectorAll('h1, h2, h3, h4, h5, h6');
        target = previewHeadings[headingIndex];
    }

    if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('outline-target-highlight');
        setTimeout(() => {
            target.classList.remove('outline-target-highlight');
        }, 1600);
    }
}
