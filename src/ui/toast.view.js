export const ToastView = {
    show(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');

        const colors = {
            success: 'bg-emerald-900/90 border border-emerald-700 text-emerald-100 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-200',
            error: 'bg-red-900/90 border border-red-700 text-red-100 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
            info: 'bg-zinc-800/90 border border-zinc-700 text-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-200'
        };
        const icons = {
            success: 'check_circle',
            error: 'error_outline',
            info: 'info'
        };

        toast.className = `${colors[type]} px-3.5 py-2.5 rounded shadow-lg flex items-center gap-2.5 min-w-[220px] pointer-events-auto transition-all duration-300 font-mono text-xs`;
        toast.innerHTML = `
            <span class="material-symbols-outlined text-[24px]">${icons[type]}</span>
            <span class="font-medium">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};