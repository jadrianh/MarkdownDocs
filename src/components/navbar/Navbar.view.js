/**
 * Navbar View Module
 * DOM queries, reactive element state, and UI bindings for top navigation bar.
 */

export const NavbarView = {
    elements: {},

    init() {
        this.elements = {
            importFileInput: document.getElementById('importFileInput'),
            importMdBtn: document.getElementById('importMdBtn'),
            btnDownloadDropdown: document.getElementById('btnDownloadDropdown'),
            menuDownload: document.getElementById('menuDownload'),
            downloadMdBtn: document.getElementById('downloadMdBtn'),
            downloadPdfBtn: document.getElementById('downloadPdfBtn'),
            themeSettingsBtn: document.getElementById('themeSettingsBtn'),
            analyzeBtn: document.getElementById('analyzeBtn')
        };
    },

    setAnalyzing(isAnalyzing) {
        const { analyzeBtn } = this.elements;
        if (!analyzeBtn) return;

        if (isAnalyzing) {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }
};
