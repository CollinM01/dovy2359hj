/* product-media-gallery.js — Atlas Dovy product image gallery */

class ProductMediaGallery extends HTMLElement {
  connectedCallback() {
    this.mainItems   = this.querySelectorAll('.product-gallery__item');
    this.thumbnails  = this.querySelectorAll('.product-thumbnail');

    if (!this.mainItems.length) return;

    this.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const mediaId = thumb.dataset.targetMedia;
        if (mediaId) this.setActiveMedia(mediaId);
      });
    });

    /* Keyboard navigation */
    this.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') this._nextMedia();
      if (e.key === 'ArrowLeft')  this._prevMedia();
    });
  }

  setActiveMedia(mediaId) {
    const targetId = String(mediaId);

    this.mainItems.forEach(item => {
      item.classList.toggle('active', item.dataset.mediaId === targetId);
    });

    this.thumbnails.forEach(thumb => {
      thumb.classList.toggle('active', thumb.dataset.targetMedia === targetId);
    });
  }

  _activeIndex() {
    return Array.from(this.mainItems).findIndex(item => item.classList.contains('active'));
  }

  _nextMedia() {
    const idx     = this._activeIndex();
    const nextIdx = (idx + 1) % this.mainItems.length;
    const next    = this.mainItems[nextIdx];
    if (next) this.setActiveMedia(next.dataset.mediaId);
  }

  _prevMedia() {
    const idx     = this._activeIndex();
    const prevIdx = (idx - 1 + this.mainItems.length) % this.mainItems.length;
    const prev    = this.mainItems[prevIdx];
    if (prev) this.setActiveMedia(prev.dataset.mediaId);
  }
}

customElements.define('product-media-gallery', ProductMediaGallery);
