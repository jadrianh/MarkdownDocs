import { gfmProfile } from './profiles/gfm.profile.js';
import { academicProfile } from './profiles/academic.profile.js';
import { commonmarkProfile } from './profiles/commonmark.profile.js';
import { sanitizeHtml } from './common/sanitize.js';

const getStored = (key, fallback) => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(key) ?? fallback;
        }
    } catch {
        // Fallback seguro para tests / SSR
    }
    return fallback;
};

const setStored = (key, value) => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(key, value);
        }
    } catch {
        // Fallback seguro para tests / SSR
    }
};

class MarkdownParserManager {
    constructor() {
        this.profiles = new Map([
            [gfmProfile.id, gfmProfile],
            [academicProfile.id, academicProfile],
            [commonmarkProfile.id, commonmarkProfile]
        ]);

        const savedProfile = getStored('markdownProfile', 'gfm');
        this.activeProfileId = this.profiles.has(savedProfile) ? savedProfile : 'gfm';
        this.listeners = new Set();
    }

    /**
     * Obtiene el perfil actualmente activo
     */
    getActiveProfile() {
        return this.profiles.get(this.activeProfileId) || gfmProfile;
    }

    /**
     * Obtiene el ID del perfil activo
     */
    getActiveProfileId() {
        return this.activeProfileId;
    }

    /**
     * Retorna la lista de todos los perfiles disponibles para su uso en selectores de UI
     */
    getAvailableProfiles() {
        return Array.from(this.profiles.values()).map(p => ({
            id: p.id,
            name: p.name,
            shortName: p.shortName,
            description: p.description,
            badge: p.badge
        }));
    }

    /**
     * Cambia el perfil de parser activo y persiste la elección del usuario
     * @param {string} profileId - 'gfm' | 'academic' | 'commonmark'
     */
    setProfile(profileId) {
        if (!this.profiles.has(profileId)) {
            console.warn(`[ParserManager] Perfil desconocido: "${profileId}". Manteniendo "${this.activeProfileId}".`);
            return false;
        }

        if (this.activeProfileId === profileId) return true;

        this.activeProfileId = profileId;
        setStored('markdownProfile', profileId);

        // Notificar a observadores (ej: re-renderizar vista previa)
        this.listeners.forEach(callback => {
            try {
                callback(this.getActiveProfile());
            } catch (err) {
                console.error('[ParserManager] Error en listener de cambio de perfil:', err);
            }
        });

        return true;
    }

    /**
     * Suscribe un listener a cambios de perfil
     * @param {Function} callback
     * @returns {Function} función para desuscribir
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    /**
     * Compila texto Markdown a HTML según el perfil activo y lo sanitiza con DOMPurify.
     * @param {string} text - Contenido en formato Markdown
     * @returns {string} HTML sanitizado y listo para renderizar
     */
    parse(text) {
        if (!text) return '';

        try {
            // Normalizar tabulaciones a 2 espacios para consistencia con AST de listas
            const normalizedText = text.replace(/\t/g, '  ');
            const profile = this.getActiveProfile();
            const rawHtml = profile.parse(normalizedText);

            return sanitizeHtml(rawHtml);
        } catch (err) {
            console.error(`[ParserManager] Error al procesar Markdown con perfil "${this.activeProfileId}":`, err);
            return `
                <div class="p-4 border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 rounded-lg text-red-700 dark:text-red-300 font-sans text-xs flex items-center gap-3">
                    <span class="material-symbols-outlined text-[24px] text-red-500">warning</span>
                    <div>
                        <p class="font-semibold">Error al renderizar el documento</p>
                        <p class="opacity-80">Revisa la sintaxis del texto o los bloques de código.</p>
                    </div>
                </div>
            `;
        }
    }
}

export const ParserManager = new MarkdownParserManager();
