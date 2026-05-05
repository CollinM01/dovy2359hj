/* accordion.js — Atlas Dovy smooth accordion */

class AccordionComponent extends HTMLElement {
  connectedCallback() {
    this.header  = this.querySelector('.accordion__header');
    this.body    = this.querySelector('.accordion__body');
    this.content = this.querySelector('.accordion__content');

    if (!this.header || !this.body) return;

    /* Remove HTML hidden attr; we control visibility via max-height */
    const isOpen = this.header.getAttribute('aria-expanded') === 'true';
    this.body.removeAttribute('hidden');

    if (isOpen) {
      this.body.style.maxHeight = this.body.scrollHeight + 'px';
    } else {
      this.body.style.maxHeight = '0px';
    }

    this.header.addEventListener('click', () => this.toggle());
    this.header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
    });
  }

  toggle() {
    const expanded = this.header.getAttribute('aria-expanded') === 'true';
    if (expanded) this.close(); else this.open();
  }

  open() {
    this.header.setAttribute('aria-expanded', 'true');
    this.body.style.maxHeight = this.body.scrollHeight + 'px';

    /* After transition, set to auto so content can reflow freely */
    this.body.addEventListener('transitionend', () => {
      if (this.header.getAttribute('aria-expanded') === 'true') {
        this.body.style.maxHeight = 'none';
      }
    }, { once: true });
  }

  close() {
    /* Lock to pixel value before collapsing */
    this.body.style.maxHeight = this.body.scrollHeight + 'px';
    requestAnimationFrame(() => {
      this.header.setAttribute('aria-expanded', 'false');
      this.body.style.maxHeight = '0px';
    });
  }
}

customElements.define('accordion-component', AccordionComponent);
