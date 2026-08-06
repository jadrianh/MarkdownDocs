export const ThemeManager = {
    config: {
        mode: localStorage.getItem('themeMode') || 'light',
        colorRGB: localStorage.getItem('themeColor') || '99 102 241',
        editorFontFamily: localStorage.getItem('editorFontFamily') || "'JetBrains Mono', monospace",
        editorFontSize: parseInt(localStorage.getItem('editorFontSize') || '14', 10),
        previewFontFamily: localStorage.getItem('previewFontFamily') || "'Hanken Grotesk', sans-serif",
        previewFontSize: parseInt(localStorage.getItem('previewFontSize') || '15', 10),
    },

    init() {
        this.applyTheme(this.config.mode);
        this.applyColor(this.config.colorRGB);
        this.applyEditorTypography(this.config.editorFontFamily, this.config.editorFontSize);
        this.applyPreviewTypography(this.config.previewFontFamily, this.config.previewFontSize);
        this.setupEventListeners();
        this.updateUI();
    },

    setupEventListeners() {
        document.getElementById('themeSettingsBtn').addEventListener('click', () => this.openModal());
        document.getElementById('closeThemeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('themeModalBackdrop').addEventListener('click', () => this.closeModal());

        // Atajo teclado ESC para cerrar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('themeModal');
                if (modal && !modal.classList.contains('hidden')) {
                    this.closeModal();
                }
            }
        });

        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode !== this.config.mode) {
                    this.applyTheme(mode);
                    this.updateUI();
                }
            });
        });

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.currentTarget.dataset.color || e.target.dataset.color;
                if (color && color !== this.config.colorRGB) {
                    this.applyColor(color);
                    this.updateUI();
                }
            });
        });

        // --- Typography: Editor ---
        const editorFontFamilySelect = document.getElementById('editorFontFamily');
        const editorFontSizeRange = document.getElementById('editorFontSize');

        editorFontFamilySelect?.addEventListener('change', () => {
            this.config.editorFontFamily = editorFontFamilySelect.value;
            localStorage.setItem('editorFontFamily', this.config.editorFontFamily);
            this.applyEditorTypography(this.config.editorFontFamily, this.config.editorFontSize);
        });

        editorFontSizeRange?.addEventListener('input', () => {
            const size = parseInt(editorFontSizeRange.value, 10);
            this.config.editorFontSize = size;
            localStorage.setItem('editorFontSize', size);
            this.applyEditorTypography(this.config.editorFontFamily, size);
            this._updateRangeLabel('editorFontSizeValue', `${size}px`);
            this._updateRangeTrack(editorFontSizeRange);
        });

        // --- Typography: Preview ---
        const previewFontFamilySelect = document.getElementById('previewFontFamily');
        const previewFontSizeRange = document.getElementById('previewFontSize');

        previewFontFamilySelect?.addEventListener('change', () => {
            this.config.previewFontFamily = previewFontFamilySelect.value;
            localStorage.setItem('previewFontFamily', this.config.previewFontFamily);
            this.applyPreviewTypography(this.config.previewFontFamily, this.config.previewFontSize);
        });

        previewFontSizeRange?.addEventListener('input', () => {
            const size = parseInt(previewFontSizeRange.value, 10);
            this.config.previewFontSize = size;
            localStorage.setItem('previewFontSize', size);
            this.applyPreviewTypography(this.config.previewFontFamily, size);
            this._updateRangeLabel('previewFontSizeValue', `${size}px`);
            this._updateRangeTrack(previewFontSizeRange);
        });
    },

    openModal() {
        const modal = document.getElementById('themeModal');
        const backdrop = document.getElementById('themeModalBackdrop');
        const content = document.getElementById('themeModalContent');

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            backdrop.classList.remove('opacity-0');
            content.classList.remove('opacity-0', 'scale-95');
        });
        this.updateUI();
    },

    closeModal() {
        const modal = document.getElementById('themeModal');
        const backdrop = document.getElementById('themeModalBackdrop');
        const content = document.getElementById('themeModalContent');

        backdrop.classList.add('opacity-0');
        content.classList.add('opacity-0', 'scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    },

    applyTheme(mode) {
        const html = document.documentElement;
        html.classList.remove('dark', 'black-mode');

        if (mode === 'dark') {
            html.classList.add('dark');
        } else if (mode === 'black') {
            html.classList.add('dark', 'black-mode');
        }
        
        this.config.mode = mode;
        localStorage.setItem('themeMode', mode);
    },

    applyColor(rgbString) {
        document.documentElement.style.setProperty('--primary-rgb', rgbString);
        this.config.colorRGB = rgbString;
        localStorage.setItem('themeColor', rgbString);
    },

    applyEditorTypography(fontFamily, fontSize) {
        const editor = document.getElementById('editor');
        if (editor) {
            editor.style.fontFamily = fontFamily;
            editor.style.fontSize = `${fontSize}px`;
        }
    },

    applyPreviewTypography(fontFamily, fontSize) {
        const preview = document.getElementById('previewPanel');
        if (preview) {
            preview.style.fontFamily = fontFamily;
            preview.style.fontSize = `${fontSize}px`;
        }
    },

    updateUI() {
        // Theme buttons
        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            if (btn.dataset.mode === this.config.mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            if (btn.dataset.color === this.config.colorRGB) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Sync typography controls with current config
        const editorFontFamilySelect = document.getElementById('editorFontFamily');
        const editorFontSizeRange = document.getElementById('editorFontSize');
        const previewFontFamilySelect = document.getElementById('previewFontFamily');
        const previewFontSizeRange = document.getElementById('previewFontSize');

        if (editorFontFamilySelect) editorFontFamilySelect.value = this.config.editorFontFamily;
        if (editorFontSizeRange) {
            editorFontSizeRange.value = this.config.editorFontSize;
            this._updateRangeLabel('editorFontSizeValue', `${this.config.editorFontSize}px`);
            this._updateRangeTrack(editorFontSizeRange);
        }
        if (previewFontFamilySelect) previewFontFamilySelect.value = this.config.previewFontFamily;
        if (previewFontSizeRange) {
            previewFontSizeRange.value = this.config.previewFontSize;
            this._updateRangeLabel('previewFontSizeValue', `${this.config.previewFontSize}px`);
            this._updateRangeTrack(previewFontSizeRange);
        }
    },

    /** Updates the visible px label next to a slider */
    _updateRangeLabel(labelId, text) {
        const label = document.getElementById(labelId);
        if (label) label.textContent = text;
    },

    /** Updates the CSS custom property used to paint the filled track portion */
    _updateRangeTrack(input) {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const val = parseFloat(input.value);
        const pct = ((val - min) / (max - min)) * 100;
        input.style.setProperty('--range-pct', `${pct}%`);
    }
};