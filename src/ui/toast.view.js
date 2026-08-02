export const ToastView = {
    show(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');

        const colors = {
            success: 'bg-emerald-500',
            error: 'bg-red-500',
            info: 'bg-slate-700'
        };
        const icons = {
            success: 'check_circle',
            error: 'error_outline',
            info: 'info'
        };

        toast.className = `${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[250px] pointer-events-auto animate-slide-in`;
        toast.innerHTML = `
            <span class="material-icons-outlined text-xl">${icons[type]}</span>
            <span class="font-medium text-sm">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('animate-slide-in');
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};