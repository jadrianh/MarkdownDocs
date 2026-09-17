/**
 * Find & Replace Service
 * Lógica pura para búsqueda y reemplazo de texto en documentos Markdown,
 * con soporte para sensibilidad a mayúsculas/minúsculas y caracteres especiales.
 */

/**
 * Escapa caracteres especiales de expresiones regulares para búsqueda literal segura.
 *
 * @param {string} str
 * @returns {string}
 */
export function escapeRegex(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Encuentra todas las coincidencias de un término en un texto.
 *
 * @param {string} text - Contenido completo del documento.
 * @param {string} query - Término de búsqueda.
 * @param {{ matchCase?: boolean }} [options={}] - Opciones de coincidencia.
 * @returns {Array<{ index: number, start: number, end: number, matchText: string }>}
 */
export function findMatches(text, query, options = {}) {
    if (!text || !query || typeof text !== 'string' || typeof query !== 'string') {
        return [];
    }

    const matchCase = Boolean(options.matchCase);
    const flags = matchCase ? 'g' : 'gi';
    const escaped = escapeRegex(query);

    const regex = new RegExp(escaped, flags);
    const results = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Prevenir bucles infinitos con expresiones de longitud cero
        if (match[0].length === 0) {
            regex.lastIndex++;
            continue;
        }

        results.push({
            index: results.length,
            start: match.index,
            end: match.index + match[0].length,
            matchText: match[0]
        });
    }

    return results;
}

/**
 * Reemplaza una coincidencia individual en el texto.
 *
 * @param {string} text - Contenido del documento.
 * @param {{ start: number, end: number }} match - Coincidencia a reemplazar.
 * @param {string} replacement - Texto de sustitución.
 * @returns {{ newText: string, nextCursor: number }}
 */
export function replaceCurrent(text, match, replacement = '') {
    if (!text || !match || typeof match.start !== 'number' || typeof match.end !== 'number') {
        return { newText: text || '', nextCursor: 0 };
    }

    const safeReplacement = typeof replacement === 'string' ? replacement : '';
    const newText = text.substring(0, match.start) + safeReplacement + text.substring(match.end);
    const nextCursor = match.start + safeReplacement.length;

    return { newText, nextCursor };
}

/**
 * Reemplaza todas las apariciones de un término en el documento.
 *
 * @param {string} text - Contenido original.
 * @param {string} query - Término a buscar.
 * @param {string} replacement - Texto sustituto.
 * @param {{ matchCase?: boolean }} [options={}] - Opciones.
 * @returns {{ newText: string, count: number }}
 */
export function replaceAll(text, query, replacement = '', options = {}) {
    if (!text || !query || typeof text !== 'string' || typeof query !== 'string') {
        return { newText: text || '', count: 0 };
    }

    const matchCase = Boolean(options.matchCase);
    const flags = matchCase ? 'g' : 'gi';
    const escaped = escapeRegex(query);
    const regex = new RegExp(escaped, flags);

    let count = 0;
    const safeReplacement = typeof replacement === 'string' ? replacement : '';

    // Uso de función de reemplazo para evitar interpretación no deseada de secuencias $1, $&, etc.
    const newText = text.replace(regex, () => {
        count++;
        return safeReplacement;
    });

    return { newText, count };
}

/**
 * Obtiene el índice circular de la siguiente coincidencia.
 *
 * @param {number} currentIndex
 * @param {number} totalMatches
 * @returns {number}
 */
export function getNextIndex(currentIndex, totalMatches) {
    if (totalMatches <= 0) return -1;
    return (currentIndex + 1) % totalMatches;
}

/**
 * Obtiene el índice circular de la coincidencia anterior.
 *
 * @param {number} currentIndex
 * @param {number} totalMatches
 * @returns {number}
 */
export function getPrevIndex(currentIndex, totalMatches) {
    if (totalMatches <= 0) return -1;
    return (currentIndex - 1 + totalMatches) % totalMatches;
}
