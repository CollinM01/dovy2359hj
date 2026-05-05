/* search-form.js — Atlas Dovy search form with predictive toggle */

class SearchForm extends HTMLElement {
  connectedCallback() {
    this.input  = this.querySelector('input[type="search"], input[name="q"]');
    this.form   = this.querySelector('form') || this.closest('form');
    this.resultsEl = document.getElementById('predictive-search-results');

    if (!this.input) return;

    this.input.addEventListener('focus', () => this._showResults());
    this.input.addEventListener('blur', () => setTimeout(() => this._hideResults(), 200));

    this.input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.input.value = '';
        this._hideResults();
        this.input.blur();
      }
    });
  }

  _showResults() {
    if (this.resultsEl && this.input.value.trim()) {
      this.resultsEl.removeAttribute('hidden');
    }
  }

  _hideResults() {
    if (this.resultsEl) this.resultsEl.setAttribute('hidden', '');
  }
}

customElements.define('search-form', SearchForm);
