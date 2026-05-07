/* header.js — Atlas Dovy sticky header + mobile toggle */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this._lastScrollY = window.scrollY;
    this._threshold   = 60;

    window.addEventListener('scroll', () => this._handleScroll(), { passive: true });
  }

  _handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > this._threshold) {
      this.classList.add('site-header--scrolled');
    } else {
      this.classList.remove('site-header--scrolled');
    }
    this._lastScrollY = scrollY;
  }
}

customElements.define('site-header', SiteHeader);

class MobileMenuToggle extends HTMLElement {
  connectedCallback() {
    this.querySelector('button')?.addEventListener('click', () => {
      const drawer = document.querySelector('menu-drawer');
      if (drawer) drawer.openDrawer();
    });
  }
}

customElements.define('mobile-menu-toggle', MobileMenuToggle);
