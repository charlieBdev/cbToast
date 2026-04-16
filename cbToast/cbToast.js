/**
 * cbToast - A lightweight, zero-dependency toast notification package.
 */
export default class cbToast {
  constructor(options = {}) {
    // 1. DEFAULT SETTINGS
    this.options = {
      title: "Notification",
      message: "Default Message",
      type: "default",      // default, info, success, error, warning
      duration: 0,          // 0 = persistent
      position: "center",   // top-left, top-right, bottom-left, bottom-right, center
      countdown: false,     // true to show the shrinking border
      maxStack: 5,          // Max toasts per position before auto-removing oldest
      ...options 
    };
    
    this.#init();
  }

  #init() {
    let container = document.querySelector(`.cb-toast-container.${this.options.position}`);
    
    if (!container) {
      container = document.createElement('div');
      container.className = `cb-toast-container ${this.options.position}`;
      document.body.appendChild(container);
    }
    
    this.container = container;

    // --- MAX STACK LOGIC ---
    // If we already have too many toasts in this container, remove the oldest one
    const existingToasts = this.container.querySelectorAll('.cb-toast');
    if (existingToasts.length >= this.options.maxStack) {
        // The first one in the DOM is the oldest
        const oldest = existingToasts[0];
        // We call remove directly to trigger the exit animation
        this.remove(oldest);
    }

    this.#createToast();
  }

  #createToast() {
    const el = document.createElement('div');
    el.className = `cb-toast cb-toast-${this.options.type}`;
    
    el.innerHTML = `
      <div class="cb-toast-header">
        <strong class="cb-toast-title">${this.options.title}</strong>
        <button class="cb-close-btn" aria-label="Close">&times;</button>
      </div>
      <div class="cb-toast-body">${this.options.message}</div>
    `;

    this.container.appendChild(el);
    
    const canShowCountdown = this.options.countdown && this.options.duration > 0;

    // Trigger Entrance and Countdown
    setTimeout(() => {
      el.classList.add('show');
      
      if (canShowCountdown) {
        const header = el.querySelector('.cb-toast-header');
        
        // Set the variable instead of the transition property
        header.style.setProperty('--duration', `${this.options.duration}ms`);
        
        // Adding this class triggers the width change to 0% in the CSS
        el.classList.add('shrinking');
      }
    }, 10);

    // AUTO-HIDE LOGIC
    if (this.options.duration > 0) {
      this.timer = setTimeout(() => this.remove(el), this.options.duration);
    }

    // MANUAL CLOSE LOGIC
    const closeBtn = el.querySelector('.cb-close-btn');
    closeBtn.onclick = () => {
      if (this.timer) clearTimeout(this.timer);
      this.remove(el);
    };
  }

  remove(el) {
    el.classList.remove('show');
    el.classList.remove('shrinking');

    el.addEventListener('transitionend', (e) => {
      // Important: Only remove if the main toast element finished its transition
      if (e.target === el) {
        el.remove();
        if (this.container && this.container.childNodes.length === 0) {
          this.container.remove();
        }
      }
    }, { once: true });
  }
}