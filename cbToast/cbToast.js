/**
 * cbToast.js
 * A lightweight, zero-dependency toast notification library.
 */

export default class cbToast {
  constructor(options = {}) {
    // 1. DEFAULT SETTINGS
    this.options = {
      title: "Notification",
      message: "Default message",
      type: "default",      // default, info, success, error, warning
      position: "center",   // top-left, top-right, bottom-left, bottom-right, center
      duration: 0,          // 0 = persistent
      countdown: false,     // true to show the shrinking border
      maxStack: 5,          // Max toasts per position
      lightMode: false,     // Toggle light/dark theme
      onClose: null,
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
    
    el.innerHTML = `
      <div class="cb-toast-header">
        <strong class="cb-toast-title">${this.options.title}</strong>
        <button class="cb-toast-close-btn" aria-label="Close">×</button>
      </div>
      <div class="cb-toast-body">${this.options.message}</div>
    `;

    // Add to DOM
    this.container.appendChild(el);
    
    const canShowCountdown = this.options.countdown && this.options.duration > 0;

    // Trigger Entrance and Countdown
    setTimeout(() => {
      el.classList.add('show');
      
      if (canShowCountdown) {
        const header = el.querySelector('.cb-toast-header');
        // We pass the duration to CSS via a Variable so the ::after element can see it
        header.style.setProperty('--duration', `${this.options.duration}ms`);
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