/**
 * cbToast - A lightweight, zero-dependency toast notification package.
 */
export default class cbToast {
  constructor(options = {}) {
    // 1. DEFAULT SETTINGS
    // These apply if the user doesn't provide their own values.
    this.options = {
      title: "Notification",
      message: "Default Message",
      type: "default",      // default, info, success, error, warning
      duration: 0,    // 0 = persistent (won't auto-hide)
      position: "center", // top-left, top-right, bottom-left, bottom-right, center
      ...options 
    };
    
    this.#init();
  }

  /**
   * INITIALIZATION
   * Finds or creates the fixed container on the screen.
   */
  #init() {
    // Check if a container for this specific position already exists
    let container = document.querySelector(`.cb-toast-container.${this.options.position}`);
    
    if (!container) {
      container = document.createElement('div');
      container.className = `cb-toast-container ${this.options.position}`;
      document.body.appendChild(container);
    }
    
    this.container = container;
    this.#createToast();
  }

  /**
   * DOM CREATION
   * Builds the HTML structure of the toast.
   */
  #createToast() {
    const el = document.createElement('div');
    
    // Apply classes for styling and color themes
    el.className = `cb-toast cb-toast-${this.options.type}`;
    
    el.innerHTML = `
      <div class="cb-toast-header">
        <strong class="cb-toast-title">${this.options.title}</strong>
        <button class="cb-close-btn" aria-label="Close">&times;</button>
      </div>
      <div class="cb-toast-body">
        ${this.options.message}
      </div>
    `;

    // Add to the screen container
    this.container.appendChild(el);
    
    // TRIGGER ANIMATION
    // Small timeout ensures the browser registers the element before sliding it in
    setTimeout(() => el.classList.add('show'), 10);

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

  /**
   * REMOVAL
   * Handles the exit animation and deletes the element from the DOM.
   */
  remove(el) {
    // 1. Start the exit animation (CSS transform/opacity)
    el.classList.remove('show');

    // 2. Wait for the transition to finish (0.3s) before fully deleting
    el.addEventListener('transitionend', () => {
      el.remove();
      
      // CLEANUP: If the container is empty, remove it to keep the DOM tidy
      if (this.container && this.container.childNodes.length === 0) {
        this.container.remove();
      }
    }, { once: true });
  }
}