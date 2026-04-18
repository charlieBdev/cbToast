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

export default class cbToast {
  constructor(options = {}) {
    // 1. DEFAULT SETTINGS
    this.options = {
      title: 'Notification',
      icon: true,
      message: 'Message',
      type: "default",        // default, info, success, error, warning
      position: "center",     // top-left, top-right, bottom-left, bottom-right, center
      duration: 3000,         // 0 = persistent
      countdown: true,        // true to show the shrinking border
      maxStack: 5,            // Max toasts per position
      useBS5Theme: false,     // If true, will check for 'data-bs-theme' on body and match it to bs primary
      lightMode: false,       // Toggle light/dark theme
      onClose: null,          // Callback fn
      ...options
    };
    
    this.#init();
  }

  /**
   * STATIC METHOD: Allows calling cbToast.show({...}) 
   * instead of using the 'new' keyword.
   */
  static show(options) {
    return new cbToast(options);
  }

  #init() {
    // Check for existing container or create a new one for this position
    let container = document.querySelector(`.cb-toast-container.${this.options.position}`);
    
    if (!container) {
      container = document.createElement('div');
      container.className = `cb-toast-container ${this.options.position}`;
      document.body.appendChild(container);
    }
    
    this.container = container;

    // --- MAX STACK LOGIC ---
    // If we exceed the limit, remove the oldest toast in this container
    const existingToasts = this.container.querySelectorAll('.cb-toast');
    if (existingToasts.length >= this.options.maxStack) {
        this.remove(existingToasts[0]); 
    }

    this.#createToast();
  }

  #createToast() {
    const el = document.createElement('div');
    
    // Set the theme attribute for CSS targeting
    const theme = this.options.lightMode ? 'light' : 'dark';
    el.setAttribute('data-theme', theme);
    
    // Apply classes for type (e.g., cb-toast-success)
    el.className = `cb-toast cb-toast-${this.options.type}`;
    
    // Define the SVG Close Button once to keep it clean
    const closeBtnHtml = `
      <button class="cb-toast-close-btn" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>`;

    const showIcon = this.options.icon && toastIcons[this.options.type];

    // Build HTML: If no title, put the close button INSIDE the body
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
      </div>
    `;

    // Add to DOM
    this.container.appendChild(el);
    
    const canShowCountdown = this.options.countdown && this.options.duration > 0;

    // Trigger Entrance and Countdown
    setTimeout(() => {
      el.classList.add('show');
      
      if (canShowCountdown) {
        const body = el.querySelector('.cb-toast-body');
        // We pass the duration to CSS via a Variable so the ::after element can see it
        body.style.setProperty('--duration', `${this.options.duration}ms`);
        el.classList.add('shrinking');
      }
    }, 10);

    // AUTO-HIDE LOGIC
    if (this.options.duration > 0) {
      this.timer = setTimeout(() => this.remove(el), this.options.duration);
    }

    // MANUAL CLOSE LOGIC
    const closeBtn = el.querySelector('.cb-toast-close-btn');
    closeBtn.onclick = () => {
      if (this.timer) clearTimeout(this.timer);
      this.remove(el);
    };
  }

  /**
   * Removes the toast with an exit animation
   * @param {HTMLElement} el - The toast element to remove
   */
  remove(el) {
    if (!el || el.dataset.removing) return; 
    el.dataset.removing = "true"; // Prevent double-triggering

    el.classList.remove('show');
    el.classList.remove('shrinking');

    // Trigger the callback if it exists
    if (typeof this.options.onClose === 'function') {
      this.options.onClose();
    }

    // Fallback: If the transition fails to fire (e.g. reduced motion), delete after 400ms
    const fallback = setTimeout(() => {
        if (el.parentNode) el.remove();
    }, 400);

    // Wait for the opacity/transform transition to finish before deleting from DOM
    el.addEventListener('transitionend', (e) => {
      // Ensure we are reacting to the main toast transition, not the inner bar
      if (e.target === el) {
        clearTimeout(fallback);
        el.remove();
        
        // Cleanup the container if it's now empty
        if (this.container && this.container.childNodes.length === 0) {
          this.container.remove();
        }
      }
    }, { once: true });
  }
}