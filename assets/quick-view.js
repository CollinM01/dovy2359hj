/* quick-view.js — Atlas Dovy quick view modal */

class QuickViewModal extends HTMLElement {
  connectedCallback() {
    this.panel   = null;
    this.overlay = null;
    this.closeBtn = null;

    /* Listen for external open events */
    document.addEventListener('open-quick-view', e => {
      if (e.detail && e.detail.url) this.open(e.detail.url);
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  }

  async open(productUrl) {
    /* Build URL with section render API */
    const url = `${productUrl}?section_id=quick-view-modal`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load product');
      const html = await res.text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const content = doc.querySelector('.quick-view-modal__content, #QuickViewContent');
      const payload = content ? content.innerHTML : doc.body.innerHTML;

      const contentEl = document.getElementById('QuickViewContent');
      if (contentEl) contentEl.innerHTML = payload;

      this.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      /* Bind close triggers */
      document.getElementById('QuickViewClose')?.addEventListener('click', () => this.close());
      document.getElementById('QuickViewClose2')?.addEventListener('click', () => this.close());

      /* Trap focus */
      const panel = document.querySelector('.quick-view-modal__panel');
      if (panel && window.trapFocus) window.trapFocus(panel);

      /* Re-init custom elements inside new content */
      if (window.customElements) {
        document.querySelectorAll('product-form:not([data-initialized])').forEach(el => {
          el.setAttribute('data-initialized', 'true');
          el.connectedCallback && el.connectedCallback();
        });
        document.querySelectorAll('product-media-gallery:not([data-initialized])').forEach(el => {
          el.setAttribute('data-initialized', 'true');
          el.connectedCallback && el.connectedCallback();
        });
        document.querySelectorAll('accordion-component:not([data-initialized])').forEach(el => {
          el.setAttribute('data-initialized', 'true');
          el.connectedCallback && el.connectedCallback();
        });
      }
    } catch (err) {
      console.warn('QuickView: could not load product', err);
    }
  }

  close() {
    const modal = document.getElementById('QuickViewModal');
    if (modal) modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.removeTrapFocus) window.removeTrapFocus();
  }
}

customElements.define('quick-view-modal', QuickViewModal);
