/* predictive-search.js — Atlas Dovy debounced search suggest */

class PredictiveSearch extends HTMLElement {
  connectedCallback() {
    this.input      = this.querySelector('input[type="search"], input[name="q"]');
    this.resultsEl  = this.querySelector('[data-predictive-results]') || document.getElementById('predictive-search-results');

    if (!this.input) return;

    this._handleInput = window.debounce
      ? window.debounce(this._fetchSuggestions.bind(this), 300)
      : this._fetchSuggestions.bind(this);

    this.input.addEventListener('input', () => {
      if (this.input.value.trim().length < 2) {
        this._clearResults();
        return;
      }
      this._handleInput();
    });

    this.input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.input.value = '';
        this._clearResults();
      }
    });

    /* Hide results on outside click */
    document.addEventListener('click', e => {
      if (!this.contains(e.target)) this._clearResults();
    });
  }

  async _fetchSuggestions() {
    const query = encodeURIComponent(this.input.value.trim());
    if (!query) return;

    try {
      const res = await fetch(
        `/search/suggest.json?q=${query}&resources[type]=product,query&resources[limit]=5&section_id=predictive-search`
      );
      const data = await res.json();
      this._renderResults(data.resources);
    } catch (e) {}
  }

  _renderResults(resources) {
    if (!this.resultsEl) return;

    const products = resources?.results?.products || [];
    const queries  = resources?.results?.queries  || [];

    if (!products.length && !queries.length) {
      this.resultsEl.innerHTML = `<p class="predictive-search__no-results">No results found.</p>`;
      this.resultsEl.removeAttribute('hidden');
      return;
    }

    const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n / 100);

    let html = '';

    if (queries.length) {
      html += `<div class="predictive-search__group">
        <h3 class="predictive-search__group-title">Suggestions</h3>
        ${queries.map(q => `<a href="${q.url}" class="predictive-search__item">${q.styled_text || q.text}</a>`).join('')}
      </div>`;
    }

    if (products.length) {
      html += `<div class="predictive-search__group">
        <h3 class="predictive-search__group-title">Products</h3>
        ${products.map(p => `
          <a href="${p.url}" class="predictive-search__item predictive-search__item--product">
            ${p.featured_image ? `<img src="${p.featured_image.url}" alt="${p.title}" width="40" height="40" loading="lazy">` : ''}
            <span>${p.title}</span>
            <span style="margin-left:auto;font-size:0.875rem;font-weight:600">${money(p.price)}</span>
          </a>`).join('')}
      </div>`;
    }

    this.resultsEl.innerHTML = html;
    this.resultsEl.removeAttribute('hidden');
  }

  _clearResults() {
    if (this.resultsEl) {
      this.resultsEl.innerHTML = '';
      this.resultsEl.setAttribute('hidden', '');
    }
  }
}

customElements.define('predictive-search', PredictiveSearch);
