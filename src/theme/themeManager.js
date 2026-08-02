export const ThemeManager = {
    config: {
        mode: localStorage.getItem('themeMode') || 'light',
        colorRGB: localStorage.getItem('themeColor') || '99 102 241' 
    },

    init() {
        this.applyTheme(this.config.mode);
        this.applyColor(this.config.colorRGB);
        this.setupEventListeners();
        this.updateUI();
    },

    setupEventListeners() {
        document.getElementById('themeSettingsBtn').addEventListener('click', () => this.openModal());
        document.getElementById('closeThemeModal').addEventListener('click', () => this.closeModal());
        document.getElementById('themeModalBackdrop').addEventListener('click', () => this.closeModal());

        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.applyTheme(mode);
                this.updateUI();
            });
        });

        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.target.dataset.color;
                this.applyColor(color);
                this.updateUI();
            });
        });
    },

    openModal() {
        const modal = document.getElementById('themeModal');
        const backdrop = document.getElementById('themeModalBackdrop');
        const content = document.getElementById('themeModalContent');

        modal.classList.remove('hidden');
        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            content.classList.remove('opacity-0', 'scale-95');
        }, 10);
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

    updateUI() {
        document.querySelectorAll('.theme-option-btn').forEach(btn => {
            if (btn.dataset.mode === this.config.mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.querySelectorAll('.color-btn').forEach(btn => {
            if (btn.dataset.color === this.config.colorRGB) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
};