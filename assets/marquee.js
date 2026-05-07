/* marquee.js — Atlas Dovy continuous marquee */

class MarqueeComponent extends HTMLElement {
  connectedCallback() {
    const inner = this.querySelector('.marquee-inner');
    if (!inner) return;

    /* Apply speed from data attribute or parent section setting */
    const speed = this.dataset.speed || this.closest('[data-speed]')?.dataset.speed || '40';
    const inners = this.querySelectorAll('.marquee-inner');
    inners.forEach(el => {
      el.style.animationDuration = `${speed}s`;
    });

    /* Pause on hover */
    this.addEventListener('mouseenter', () => {
      inners.forEach(el => (el.style.animationPlayState = 'paused'));
    });

    this.addEventListener('mouseleave', () => {
      inners.forEach(el => (el.style.animationPlayState = 'running'));
    });

    /* Respect reduced motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      inners.forEach(el => (el.style.animation = 'none'));
    }
  }
}

customElements.define('marquee-component', MarqueeComponent);
