/* product-form.js — Atlas Dovy variant selection + ATC */

class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form[data-product-id]');
    if (!this.form) return;

    this.productId    = this.form.dataset.productId;
    this.sectionId    = this.form.dataset.sectionId;
    this.variantInput = this.form.querySelector('input[name="id"]');

    /* Load variant data from embedded JSON */
    const dataEl = this.form.querySelector(`#ProductVariants-${this.sectionId}`);
    if (dataEl) {
      try { this.variants = JSON.parse(dataEl.textContent); }
      catch (e) { this.variants = []; }
    }

    /* Listen to radio inputs (Color swatches & Size buttons) */
    this.form.querySelectorAll('.variant-selector input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => this.onVariantChange());
    });

    /* Listen to native selects (other option types) */
    this.form.querySelectorAll('.variant-selector select').forEach(select => {
      select.addEventListener('change', () => this.onVariantChange());
    });

    /* Add-to-cart */
    this.form.addEventListener('submit', e => this.handleAddToCart(e));

    /* Set initial selected-class state */
    this.onVariantChange();
  }

  getCurrentOptions() {
    const options = [];
    this.form.querySelectorAll('.variant-selector').forEach((selector, i) => {
      const radio  = selector.querySelector('input[type="radio"]:checked');
      const select = selector.querySelector('select');
      if (radio)  options[i] = radio.value;
      else if (select) options[i] = select.value;
    });
    return options;
  }

  findVariant(options) {
    if (!this.variants) return null;
    return this.variants.find(v =>
      options.every((opt, i) => v[`option${i + 1}`] === opt)
    ) || null;
  }

  onVariantChange() {
    const options = this.getCurrentOptions();
    const variant = this.findVariant(options);

    this.updateVariantInput(variant);
    this.updateSelectedClasses(options);
    this.updatePrice(variant);
    this.updateAvailability(variant);
    this.updateMedia(variant);
    this.updateURL(variant);
  }

  updateVariantInput(variant) {
    if (this.variantInput) {
      this.variantInput.value = variant ? variant.id : '';
    }
  }

  /* Sync the --selected CSS classes with the current radio/select state */
  updateSelectedClasses(options) {
    this.form.querySelectorAll('.variant-selector').forEach((selector, i) => {
      const selectedValue = options[i];

      /* Swatch labels */
      selector.querySelectorAll('.swatch').forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        label.classList.toggle('swatch--selected', !!(input && input.value === selectedValue));
      });

      /* Size-button labels */
      selector.querySelectorAll('.size-btn').forEach(label => {
        const input = label.querySelector('input[type="radio"]');
        label.classList.toggle('size-btn--selected', !!(input && input.value === selectedValue));
      });

      /* Color selected-value text */
      const selectedValueEl = selector.querySelector('[data-selected-value]');
      if (selectedValueEl && selectedValue !== undefined) {
        selectedValueEl.textContent = selectedValue;
      }
    });
  }

  updatePrice(variant) {
    const priceEl = document.getElementById(`price-${this.sectionId}`);
    if (!priceEl || !variant) return;

    const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);

    let html = '';
    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      html = `
        <span class="price__sale">${money(variant.price)}</span>
        <span class="price__compare"><s>${money(variant.compare_at_price)}</s></span>
        <span class="price__badge price__badge--sale">Sale</span>
      `;
    } else {
      html = `<span class="price__regular">${money(variant.price)}</span>`;
    }

    if (!variant.available) {
      html += '<span class="price__sold-out">Sold out</span>';
    }

    priceEl.className = `product-price${variant.compare_at_price > variant.price ? ' price--on-sale' : ''}`;
    priceEl.innerHTML = html;
  }

  updateAvailability(variant) {
    const btn = document.getElementById(`atc-${this.sectionId}`);
    if (!btn) return;
    const textEl = btn.querySelector('.atc-btn__text');

    if (!variant) {
      btn.disabled = true;
      if (textEl) textEl.textContent = 'Unavailable';
      return;
    }

    btn.disabled = !variant.available;
    if (textEl) textEl.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
  }

  updateMedia(variant) {
    if (!variant || !variant.featured_media) return;
    const gallery = this.querySelector('product-media-gallery');
    if (gallery && gallery.setActiveMedia) {
      gallery.setActiveMedia(variant.featured_media.id);
    }
  }

  updateURL(variant) {
    if (!variant) return;
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url.toString());
  }

  async handleAddToCart(e) {
    e.preventDefault();

    const btn = document.getElementById(`atc-${this.sectionId}`);
    if (!btn || btn.disabled) return;

    btn.classList.add('atc-btn--loading');
    btn.disabled = true;

    const formData = new FormData(this.form);
    const body = {
      id: formData.get('id'),
      quantity: parseInt(formData.get('quantity'), 10) || 1,
      sections: ['cart-drawer'],
      sections_url: window.location.pathname,
    };

    try {
      const res = await fetch('/cart/add.js', {
        ...fetchConfig('json'),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.description || 'Could not add item to cart.');
      }

      const data = await res.json();

      /* Refresh cart count badge */
      await this._refreshCart();

      /* Toast feedback */
      if (window.ToastNotification) {
        window.ToastNotification.show({ message: `${data.title || 'Item'} added to your cart!`, type: 'success' });
      }

      /* Open cart drawer */
      const drawer = document.getElementById('CartDrawer');
      if (drawer && typeof drawer.open === 'function') drawer.open();

    } catch (err) {
      if (window.ToastNotification) {
        window.ToastNotification.show({ message: err.message || 'Error adding to cart.', type: 'error' });
      }
    } finally {
      btn.classList.remove('atc-btn--loading');
      btn.disabled = false;
    }
  }

  async _refreshCart() {
    try {
      const res  = await fetch('/cart.js');
      const cart = await res.json();
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
    } catch (e) { /* fail silently */ }
  }
}

customElements.define('product-form', ProductForm);
