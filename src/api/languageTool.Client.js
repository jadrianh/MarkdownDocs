export const LanguageToolAPI = {
    async check(text, language) {
        if (!text.trim()) return { matches: [] };

        const params = new URLSearchParams();
        params.append('text', text);
        params.append('language', language);

        try {
            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    'Accept': 'application/json' 
                },
                body: params
            });

            if (!response.ok) throw new Error('Error en la red');
            return await response.json();
        } catch (error) {
            console.error("LanguageTool Error:", error);
            throw error;
        }
    }
};