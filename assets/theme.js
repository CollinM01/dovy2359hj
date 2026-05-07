(function () {
  const toastEl = document.getElementById('site-toast');
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    window.setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
  };

  document.addEventListener('click', async (event) => {
    const tab = event.target.closest('.filter-tab');
    if (tab) {
      const wrap = tab.closest('[data-collection-root]');
      wrap.querySelectorAll('.filter-tab').forEach((el) => el.classList.remove('is-active'));
      tab.classList.add('is-active');
      const target = tab.dataset.filter;
      let visible = 0;
      wrap.querySelectorAll('.product-card').forEach((card) => {
        const match = target === 'all' || card.dataset.productType === target;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      const count = wrap.querySelector('[data-product-count]');
      if (count) count.textContent = String(visible);
    }

    const qtyBtn = event.target.closest('[data-qty-change]');
    if (qtyBtn) {
      const input = qtyBtn.parentElement.querySelector('input[name="quantity"]');
      const next = Math.max(1, (parseInt(input.value, 10) || 1) + parseInt(qtyBtn.dataset.qtyChange, 10));
      input.value = String(next);
    }

    const thumb = event.target.closest('.thumb');
    if (thumb) {
      const root = thumb.closest('[data-product-page]');
      const mainImg = root?.querySelector('[data-main-image] img');
      if (mainImg && thumb.dataset.imageUrl) mainImg.src = thumb.dataset.imageUrl;
      thumb.parentElement.querySelectorAll('.thumb').forEach((b) => b.removeAttribute('aria-current'));
      thumb.setAttribute('aria-current', 'true');
    }

    const openQuick = event.target.closest('.js-quick-view');
    if (openQuick) {
      const modal = document.getElementById('quick-view');
      const content = document.getElementById('quick-view-content');
      if (!modal || !content) return;
      content.innerHTML = '<p>Loading…</p>';
      modal.hidden = false;
      try {
        const res = await fetch(`/products/${openQuick.dataset.handle}.js`);
        const product = await res.json();
        const variant = product.variants?.find(v => v.available) || product.variants?.[0];
        const currency = (window.Shopify && window.Shopify.currency && window.Shopify.currency.active) ? window.Shopify.currency.active : 'USD';
        const displayPrice = (typeof variant?.price === 'number')
          ? (variant.price / 100).toLocaleString(undefined, { style:'currency', currency })
          : '';
        content.innerHTML = `
          <div class="quick-view-body">
            <img src="${product.images?.[0] || ''}" alt="${product.title}" style="width:100%;max-height:320px;object-fit:cover;border:1px solid #ccbda5;margin-bottom:.75rem;" />
            <p class="eyebrow">${product.vendor || ''}</p>
            <h3>${product.title}</h3>
            <p>${(product.description || '').replace(/<[^>]+>/g, '').slice(0, 180)}</p>
            <p><strong>${displayPrice}</strong></p>
            <button class="button" type="button" data-quick-add="${variant?.id || ''}">Add to cart</button>
            <a class="button button--secondary" href="${product.url}">View details</a>
          </div>`;
      } catch (e) {
        content.innerHTML = '<p>Unable to load quick view.</p>';
      }
    }

    const closeQuick = event.target.closest('[data-close-quick-view]');
    if (closeQuick) {
      const modal = document.getElementById('quick-view');
      if (modal) modal.hidden = true;
    }

    const quickAdd = event.target.closest('[data-quick-add]');
    if (quickAdd && quickAdd.dataset.quickAdd) {
      const id = Number(quickAdd.dataset.quickAdd);
      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, quantity: 1 })
        });
        if (!res.ok) throw new Error('Add failed');
        toast('Added to cart');
      } catch (e) {
        toast('Could not add to cart');
      }
    }
  });

  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-product-form]');
    if (!form) return;
    event.preventDefault();
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      const body = new FormData(form);
      const res = await fetch('/cart/add.js', { method: 'POST', body });
      if (!res.ok) throw new Error('Add failed');
      toast('Added to cart');
    } catch (e) {
      toast('Could not add to cart');
      form.submit();
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();
