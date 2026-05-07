/* theme.js — Atlas Dovy main entry */

document.addEventListener('DOMContentLoaded', () => {
  /* Quick-view trigger delegation */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.product-card__quick-view');
    if (!btn) return;
    const url = btn.dataset.productUrl;
    if (!url) return;
    const modal = document.querySelector('quick-view-modal');
    if (modal) modal.open(url);
  });

  /* Open cart drawer on cart icon click */
  document.querySelectorAll('[data-open-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const drawer = document.getElementById('CartDrawer');
      if (drawer) drawer.open();
    });
  });

  /* Close cart drawer */
  document.addEventListener('click', e => {
    if (e.target.matches('[data-close-cart]') || e.target.closest('[data-close-cart]')) {
      const drawer = document.getElementById('CartDrawer');
      if (drawer) drawer.close();
    }
  });

  /* Product recommendations fetch */
  const recSection = document.querySelector('.product-recommendations');
  if (recSection && recSection.dataset.url) {
    fetch(recSection.dataset.url)
      .then(r => r.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const inner = doc.querySelector('.product-recommendations');
        if (inner && inner.innerHTML.trim()) {
          recSection.innerHTML = inner.innerHTML;
        }
      })
      .catch(() => {});
  }
});
