# Atlas Dovy Naturalist — Shopify Theme

A custom Shopify Online Store 2.0 theme for **Atlas Dovy**, a Pacific Northwest naturalist clothing brand. Designed with the spirit of old-growth forests, tidepools, and mountain meadows.

---

## Design System

### Palette
| Token | Hex | Use |
|-------|-----|-----|
| `--color-paper` | `#F5F0E8` | Page background |
| `--color-bark` | `#5C4033` | Primary / CTAs |
| `--color-sage` | `#6B8C6B` | Secondary / accents |
| `--color-fog` | `#C8C4BC` | Borders / dividers |
| `--color-ink` | `#1C1C1A` | Body text |
| `--color-cream` | `#FAF7F2` | Card surfaces |
| `--color-moss` | `#3A5C3A` | Conservation / accent |

### Typography
- **Display / Headings:** Cormorant Garamond (Google Fonts)
- **Body / UI:** Jost (Google Fonts)

---

## File Structure

```
├── assets/                    # CSS + JS (16 files)
├── config/                    # settings_schema.json + settings_data.json
├── layout/                    # theme.liquid + password.liquid
├── locales/                   # en.default.json
├── sections/                  # 30+ sections
├── snippets/                  # 23+ snippets + SVG icons
└── templates/                 # JSON templates for all page types
    └── customers/             # Customer account templates
```

---

## Key Sections

| Section | Description |
|---------|-------------|
| `hero-naturalist` | Full-viewport hero with Ken Burns zoom |
| `marquee-ticker` | Scrolling announcement marquee |
| `featured-products-grid` | Collection-driven product grid |
| `story-strip` | Two-column image + editorial text |
| `conservation-banner` | Full-bleed conservation CTA |
| `newsletter-naturalist` | Shopify native contact form |
| `main-product-naturalist` | Full PDP with gallery, variants, accordions |
| `main-collection-naturalist` | Collection with facet filters + tabs |
| `page-about` | Brand story with profile blocks |
| `page-conservation` | Conservation mission with value cards |
| `cart-drawer` | Slide-in cart using Sections Rendering API |

---

## JavaScript Architecture

All JS is **vanilla ES2020+**, no bundler required. Custom elements are used throughout:

- `<accordion-component>` — smooth max-height accordion
- `<cart-drawer>` — slide-in cart with sections API
- `<product-form>` — variant selection + ATC with fetch
- `<product-media-gallery>` — thumbnail keyboard navigation
- `<quick-view-modal>` — product modal via section rendering
- `<predictive-search>` — debounced suggest.json integration
- `<marquee-component>` — CSS-driven infinite scroll
- `<details-modal>` — accessible modal via `<details>`

---

## Development

```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Serve with hot reload
shopify theme dev --store your-store.myshopify.com

# Push to theme
shopify theme push
```

---

*Designed in the Pacific Northwest. 1% of revenue supports regional conservation.*