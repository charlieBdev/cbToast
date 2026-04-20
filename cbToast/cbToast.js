/**
 * cbToast.js
 * A lightweight, zero-dependency toast notification library.
 */

const toastIcons = {
    default: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
};

class _cbToast {
    constructor(options = {}) {
        this.options = {
            title: 'Notification',
            icon: true,
            message: 'Message',
            type: "default",
            position: "center",
            duration: 3000,
            countdown: true,
            maxStack: 5,
            lightMode: false,
            useBS5Theme: false,
            pauseOnHover: true,
            onClose: null,
            ...options
        };

        this.remaining = this.options.duration;
        this.startTime = null;
        this.timer = null;

        this.#init();
    }

    #init() {
        const positionClassMap = {
            'top-right': 'cb-toast-top-right',
            'top-left': 'cb-toast-top-left',
            'bottom-right': 'cb-toast-bottom-right',
            'bottom-left': 'cb-toast-bottom-left',
            'center': 'cb-toast-center'
        };

        const targetClass = positionClassMap[this.options.position] || 'cb-toast-center';

        // Select container by the specific unique class
        let container = document.querySelector(`.cb-toast-container.${targetClass}`);

        if (!container) {
            container = document.createElement('div');
            container.className = `cb-toast-container ${targetClass}`;
            document.body.appendChild(container);
        }
        this.container = container;

        const activeToasts = Array.from(this.container.querySelectorAll('.cb-toast'))
            .filter(t => !t.dataset.removing);

        if (activeToasts.length >= this.options.maxStack) {
            this.remove(activeToasts[0]);
        }

        this.#createToast();
    }

    #createToast() {
        const el = document.createElement('div');

        let theme = this.options.lightMode ? 'light' : 'dark';

        if (this.options.useBS5Theme) {
            el.classList.add('cb-toast-bs5');
            const bsTheme = document.documentElement.getAttribute('data-bs-theme') ||
                document.body.getAttribute('data-bs-theme');
            if (bsTheme) theme = bsTheme;
        }

        el.setAttribute('data-theme', theme);
        el.className += ` cb-toast cb-toast-${this.options.type}`;

        const closeBtnHtml = `
            <button class="cb-toast-close-btn" aria-label="Close">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="5" x2="5" y2="19"></line>
                <line x1="5" y1="5" x2="19" y2="19"></line>
                </svg>
            </button>`;

        const showIcon = this.options.icon && toastIcons[this.options.type];

        el.innerHTML = `
        ${this.options.title ? `
            <div class="cb-toast-header">
                <div class="cb-toast-title-wrapper">
                    ${showIcon ? `<span class="cb-toast-icon">${toastIcons[this.options.type]}</span>` : ''}
                    <strong class="cb-toast-title">${this.options.title}</strong>
                </div>
                ${closeBtnHtml}
            </div>` : ''}
            <div class="cb-toast-body">
                <div class="cb-toast-content">${this.options.message}</div>
                ${!this.options.title ? closeBtnHtml : ''}
            </div>`;

        this.container.appendChild(el);

        const body = el.querySelector('.cb-toast-body');

        const startTimer = () => {
            if (this.options.duration > 0) {
                this.startTime = Date.now();
                this.timer = setTimeout(() => this.remove(el), this.remaining);

                if (this.options.countdown) {
                    body.style.setProperty('--duration', `${this.remaining}ms`);
                    // Use unique state class cb-shrinking
                    el.classList.add('cb-shrinking');
                }
            }
        };

        const pauseTimer = () => {
            if (!this.options.pauseOnHover) return;

            clearTimeout(this.timer);
            const elapsed = Date.now() - this.startTime;
            const currentProgress = (this.remaining - elapsed) / this.options.duration;
            body.style.setProperty('--progress', currentProgress);

            this.remaining -= elapsed;
            // Use unique state class cb-shrinking
            el.classList.remove('cb-shrinking');
        };

        el.addEventListener('mouseenter', pauseTimer);
        el.addEventListener('mouseleave', () => {
            if (this.options.pauseOnHover && this.remaining > 0) {
                startTimer();
            }
        });

        setTimeout(() => {
            // Use unique state class cb-show
            el.classList.add('cb-show');
            startTimer();
        }, 10);

        const closeBtn = el.querySelector('.cb-toast-close-btn');
        closeBtn.onclick = () => {
            clearTimeout(this.timer);
            this.remove(el);
        };
    }

    remove(el) {
        if (!el || el.dataset.removing) return;
        el.dataset.removing = "true";

        const body = el.querySelector('.cb-toast-body');
        if (body && this.startTime) {
            const elapsed = Date.now() - this.startTime;
            const finalProgress = Math.max(0, (this.remaining - elapsed) / this.options.duration);
            body.style.setProperty('--progress', finalProgress);
        }

        // Use unique state classes
        el.classList.remove('cb-show');
        el.classList.remove('cb-shrinking');

        if (typeof this.options.onClose === 'function') {
            this.options.onClose();
        }

        const fallback = setTimeout(() => { if (el.parentNode) el.remove(); }, 400);

        el.addEventListener('transitionend', (e) => {
            if (e.target === el) {
                clearTimeout(fallback);
                el.remove();
                if (this.container && this.container.childNodes.length === 0) {
                    this.container.remove();
                }
            }
        }, { once: true });
    }
}

const cbToast = (options) => {
    return new _cbToast(options);
};

export default cbToast;