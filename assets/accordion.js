/* accordion.js — Atlas Dovy smooth accordion */

class AccordionComponent extends HTMLElement {
  connectedCallback() {
    /* .accordion__header  = the <button> trigger
       .accordion__body    = the collapsible wrapper (max-height animated)
       .accordion__content = the inner padding div */
    this.header = this.querySelector('.accordion__header');
    this.body   = this.querySelector('.accordion__body');

    if (!this.header || !this.body) return;

    /* Remove HTML hidden attr; control visibility via max-height instead */
    const isOpen = this.header.getAttribute('aria-expanded') === 'true';
    this.body.removeAttribute('hidden');

    if (isOpen) {
      this.body.style.maxHeight = 'none';
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

    /* After transition, set to 'none' so content can reflow freely */
    this.body.addEventListener('transitionend', () => {
      if (this.header.getAttribute('aria-expanded') === 'true') {
        this.body.style.maxHeight = 'none';
      }
    }, { once: true });
  }

  close() {
    /* Lock to current pixel height before collapsing to allow CSS transition */
    this.body.style.maxHeight = this.body.scrollHeight + 'px';
    requestAnimationFrame(() => {
      this.header.setAttribute('aria-expanded', 'false');
      this.body.style.maxHeight = '0px';
    });
  }
}

customElements.define('accordion-component', AccordionComponent);
