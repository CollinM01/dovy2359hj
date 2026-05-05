/* cart-drawer.js — Atlas Dovy AJAX cart drawer */

class CartDrawer extends HTMLElement {
  connectedCallback() {
    this._bindEvents();
  }

  _bindEvents() {
    /* Cart change buttons inside drawer (qty +/-/remove) */
    this.addEventListener('click', async e => {
      const btn = e.target.closest('[data-cart-change]');
      if (!btn) return;
      const line     = btn.dataset.line;
      const quantity = parseInt(btn.dataset.quantity, 10);
      if (line !== undefined && !isNaN(quantity)) {
        await this.updateQuantity(line, quantity);
      }
    });

    /* Qty input changes */
    this.addEventListener('change', async e => {
      const input = e.target.closest('[data-cart-quantity]');
      if (!input) return;
      const line     = input.dataset.line;
      const quantity = parseInt(input.value, 10);
      if (line !== undefined && !isNaN(quantity)) {
        await this.updateQuantity(line, quantity);
      }
    });
  }

  open() {
    this.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const panel = this.querySelector('.cart-drawer__panel');
    if (panel && window.trapFocus) window.trapFocus(panel);
    this._loadCart();
  }

  close() {
    this.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.removeTrapFocus) window.removeTrapFocus();
  }

  async _loadCart() {
    try {
      const res  = await fetch('/?sections=cart-drawer');
      const data = await res.json();
      if (data['cart-drawer']) {
        this._injectHTML(data['cart-drawer']);
      }
    } catch (e) {
      /* Fail silently; existing content remains */
    }
  }

  _injectHTML(html) {
    const doc      = new DOMParser().parseFromString(html, 'text/html');
    const bodyEl   = doc.querySelector('.cart-drawer__body');
    const footerEl = doc.querySelector('.cart-drawer__footer');

    const localBody   = this.querySelector('.cart-drawer__body');
    const localFooter = document.getElementById('CartDrawer-Footer');

    if (localBody   && bodyEl)   localBody.innerHTML   = bodyEl.innerHTML;
    if (localFooter && footerEl) localFooter.innerHTML = footerEl.innerHTML;
  }

  renderContents(cart) {
    const itemsEl  = document.getElementById('CartDrawer-Items');
    const footerEl = document.getElementById('CartDrawer-Footer');

    if (itemsEl) {
      if (cart.item_count === 0) {
        itemsEl.innerHTML = `
          <div class="cart-drawer__empty">
            <p>Your cart is empty.</p>
            <a href="/collections/all" class="btn btn--primary" data-close-cart>Shop Now</a>
          </div>`;
      } else {
        itemsEl.innerHTML = cart.items.map(item => this._renderItem(item)).join('');
      }
    }

    if (footerEl) {
      if (cart.item_count > 0) {
        const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);
        footerEl.innerHTML = `
          <div class="cart-drawer__subtotal">
            <span>Subtotal</span>
            <span>${money(cart.total_price)}</span>
          </div>
          <p class="cart-drawer__tax-note">Taxes and shipping calculated at checkout.</p>
          <a href="/checkout" class="btn btn--primary btn--full">Checkout</a>
          <a href="/cart" class="btn btn--ghost btn--full cart-drawer__view-cart">View Cart</a>
        `;
      } else {
        footerEl.innerHTML = '';
      }
    }

    /* Update badge */
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = cart.item_count;
      el.style.display = cart.item_count > 0 ? 'flex' : 'none';
    });
  }

  _renderItem(item) {
    const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);
    const imgSrc = item.image ? item.image.replace('.jpg', '_120x120.jpg').replace('.png', '_120x120.png') : '';
    const variantLine = item.variant_title && item.variant_title !== 'Default Title'
      ? `<p class="cart-item__variant">${item.variant_title}</p>` : '';

    return `
      <div class="cart-item" data-key="${item.key}" data-variant-id="${item.variant_id}">
        <a href="${item.url}" class="cart-item__image-link">
          ${imgSrc ? `<img src="${imgSrc}" alt="${item.title}" width="80" height="80" loading="lazy">` : ''}
        </a>
        <div class="cart-item__details">
          <a href="${item.url}" class="cart-item__title">${item.product_title}</a>
          ${variantLine}
          <div class="cart-item__bottom">
            <quantity-input class="qty-stepper qty-stepper--small">
              <button type="button" class="qty-stepper__btn" data-cart-change data-line="${item.key}" data-quantity="${item.quantity - 1}" aria-label="Decrease">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <input type="number" class="qty-stepper__input" value="${item.quantity}" min="0" data-cart-quantity data-line="${item.key}">
              <button type="button" class="qty-stepper__btn" data-cart-change data-line="${item.key}" data-quantity="${item.quantity + 1}" aria-label="Increase">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </quantity-input>
            <p class="cart-item__price">${money(item.final_line_price)}</p>
          </div>
        </div>
        <button class="cart-item__remove" data-cart-change data-line="${item.key}" data-quantity="0" aria-label="Remove ${item.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>`;
  }

  async updateQuantity(line, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ id: line, quantity }),
      });

      if (!res.ok) throw new Error('Cart update failed');
      const cart = await res.json();
      this.renderContents(cart);
    } catch (err) {
      if (window.ToastNotification) {
        window.ToastNotification.show({ message: 'Could not update cart.', type: 'error' });
      }
    }
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends HTMLElement {}
customElements.define('cart-drawer-items', CartDrawerItems);
