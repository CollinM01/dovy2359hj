/* toast.js — Atlas Dovy toast notification system */

class ToastNotification {
  constructor() {
    this.container = null;
    this._ensureContainer();
  }

  _ensureContainer() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
  }

  show({ message, type = 'success', duration = 3500 }) {
    this._ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    const iconMap = {
      success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
      error:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    };

    toast.innerHTML = `
      <span class="toast__icon">${iconMap[type] || iconMap.info}</span>
      <span class="toast__message">${this._escape(message)}</span>
      <button class="toast__close" aria-label="Close notification">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;

    toast.querySelector('.toast__close').addEventListener('click', () => this._remove(toast));
    this.container.appendChild(toast);

    /* Trigger enter animation */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('toast--visible'));
    });

    if (duration > 0) {
      setTimeout(() => this._remove(toast), duration);
    }

    return toast;
  }

  _remove(toast) {
    toast.classList.remove('toast--visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    /* Fallback in case transition doesn't fire */
    setTimeout(() => toast.remove(), 500);
  }

  _escape(str) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }
}

window.ToastNotification = new ToastNotification();
