/* details-modal.js — generic modal backed by <details> with overlay + focus trap */

class DetailsModal extends HTMLElement {
  connectedCallback() {
    this.details  = this.querySelector('details');
    this.summary  = this.querySelector('summary');
    this.overlay  = this.querySelector('.modal-overlay');
    this.closeBtn = this.querySelector('[data-modal-close]');

    if (!this.details) return;

    this.details.addEventListener('toggle', () => {
      if (this.details.open) {
        document.body.style.overflow = 'hidden';
        if (window.trapFocus) window.trapFocus(this);
        this.overlay?.classList.add('modal-overlay--visible');
      } else {
        document.body.style.overflow = '';
        if (window.removeTrapFocus) window.removeTrapFocus(this.summary);
        this.overlay?.classList.remove('modal-overlay--visible');
      }
    });

    this.overlay?.addEventListener('click', () => this._close());
    this.closeBtn?.addEventListener('click', () => this._close());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.details?.open) this._close();
    });
  }

  _close() {
    if (this.details) this.details.open = false;
  }
}

customElements.define('details-modal', DetailsModal);
