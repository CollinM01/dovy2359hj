/* global.js — Atlas Dovy utility functions and base custom elements */

/* ── Utilities ──────────────────────────────────────────────────────── */
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach(video => video.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*'));
  document.querySelectorAll('.js-vimeo').forEach(video => video.contentWindow.postMessage('{"method":"pause"}', '*'));
  document.querySelectorAll('video').forEach(video => video.pause());
}

/* ── Focus Trap ─────────────────────────────────────────────────────── */
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'summary, a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), [draggable], area, input:not([type=hidden]):not([disabled]), select:not([disabled]), textarea:not([disabled]), object, iframe'
    )
  );
}

function trapFocus(container, elementToFocus = container) {
  const elements = getFocusableElements(container);
  const first = elements[0];
  const last = elements[elements.length - 1];

  function handleKeyDown(e) {
    if (e.code !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  removeTrapFocus();
  container.addEventListener('keydown', handleKeyDown);
  container._trapFocusHandler = handleKeyDown;
  elementToFocus.focus();
}

function removeTrapFocus(elementToFocus) {
  document.querySelectorAll('[data-trap-focus]').forEach(el => {
    if (el._trapFocusHandler) el.removeEventListener('keydown', el._trapFocusHandler);
  });
  if (elementToFocus) elementToFocus.focus();
}

/* ── FocusVisiblePolyfill ───────────────────────────────────────────── */
class FocusVisiblePolyfill {
  constructor() {
    const { documentElement } = document;
    let focusVisible = false;

    function onKeyDown() {
      if (focusVisible) return;
      focusVisible = true;
      documentElement.classList.add('focus-visible');
    }

    function onPointerDown() {
      if (!focusVisible) return;
      focusVisible = false;
      documentElement.classList.remove('focus-visible');
    }

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
  }
}

new FocusVisiblePolyfill();

/* ── QuantityInput ──────────────────────────────────────────────────── */
class QuantityInput extends HTMLElement {
  connectedCallback() {
    this.input = this.querySelector('.qty-stepper__input');
    this.minusBtn = this.querySelector('[name="minus"]');
    this.plusBtn = this.querySelector('[name="plus"]');

    if (!this.input) return;

    this.minusBtn?.addEventListener('click', () => this.adjustQty(-1));
    this.plusBtn?.addEventListener('click', () => this.adjustQty(1));
    this.input.addEventListener('change', () => this.validateInput());
  }

  adjustQty(delta) {
    const currentVal = parseInt(this.input.value, 10) || 1;
    const min = parseInt(this.input.min, 10) || 0;
    const max = parseInt(this.input.max, 10) || Infinity;
    const newVal = Math.min(Math.max(currentVal + delta, min), max);
    this.input.value = newVal;
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  validateInput() {
    const min = parseInt(this.input.min, 10) || 0;
    const max = parseInt(this.input.max, 10) || Infinity;
    const val = parseInt(this.input.value, 10);
    if (isNaN(val) || val < min) this.input.value = min;
    if (val > max) this.input.value = max;
  }
}

customElements.define('quantity-input', QuantityInput);

/* ── MenuDrawer ─────────────────────────────────────────────────────── */
class MenuDrawer extends HTMLElement {
  connectedCallback() {
    this.openBtn = document.querySelector('[data-open-menu]');
    this.closeBtn = this.querySelector('[data-close-menu]');
    this.overlay  = this.querySelector('.mobile-nav-drawer__overlay');

    this.openBtn?.addEventListener('click', () => this.openDrawer());
    this.closeBtn?.addEventListener('click', () => this.closeDrawer());
    this.overlay?.addEventListener('click', () => this.closeDrawer());

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.classList.contains('mobile-nav-drawer--open')) {
        this.closeDrawer();
      }
    });
  }

  openDrawer() {
    this.classList.add('mobile-nav-drawer--open');
    document.body.style.overflow = 'hidden';
    const panel = this.querySelector('.mobile-nav-drawer__panel');
    if (panel) trapFocus(panel);
  }

  closeDrawer() {
    this.classList.remove('mobile-nav-drawer--open');
    document.body.style.overflow = '';
    removeTrapFocus(document.querySelector('[data-open-menu]'));
  }
}

customElements.define('menu-drawer', MenuDrawer);

/* ── DetailsDisclosure ──────────────────────────────────────────────── */
class DetailsDisclosure extends HTMLElement {
  connectedCallback() {
    this.details = this.querySelector('details');
    this.summary = this.querySelector('summary');
    if (!this.details) return;
    this.summary?.addEventListener('click', e => this.handleClick(e));
  }

  handleClick(e) {
    e.preventDefault();
    this.details.open ? this.close() : this.open();
  }

  open() {
    this.details.open = true;
  }

  close() {
    this.details.open = false;
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

/* ── DeferredMedia ──────────────────────────────────────────────────── */
class DeferredMedia extends HTMLElement {
  connectedCallback() {
    this.poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!this.poster) return;
    this.poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent() {
    window.pauseAllMedia = pauseAllMedia;
    pauseAllMedia();
    const content = this.querySelector('template');
    if (!content) return;
    this.appendChild(content.content.firstElementChild.cloneNode(true));
    this.classList.add('loaded');
    this.poster.remove();
  }
}

customElements.define('deferred-media', DeferredMedia);

/* ── Expose globals ──────────────────────────────────────────────────── */
window.debounce = debounce;
window.fetchConfig = fetchConfig;
window.pauseAllMedia = pauseAllMedia;
window.trapFocus = trapFocus;
window.removeTrapFocus = removeTrapFocus;
window.getFocusableElements = getFocusableElements;
