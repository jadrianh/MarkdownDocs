export const LanguageToolAPI = {
    async check(text, language) {
        if (!text.trim()) return { matches: [] };

        const params = new URLSearchParams();
        params.append('text', text);
        params.append('language', language);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'Accept': 'application/json' 
                },
                body: params,
                signal: controller.signal
            });

            if (!response.ok) throw new Error(`Error en la red: ${response.status}`);
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("LanguageTool Error: Tiempo de espera agotado (12s)");
                throw new Error('Tiempo de espera agotado al conectar con LanguageTool');
            }
            console.error("LanguageTool Error:", error);
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    }
};