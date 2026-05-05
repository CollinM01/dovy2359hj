# Atlas Dovy Naturalist — Shopify Theme

A custom Shopify Online Store 2.0 theme for **Atlas Dovy**, a Pacific Northwest naturalist clothing brand. Designed with the spirit of old-growth forests, tidepools, and mountain meadows.

---

## Connecting the Theme from GitHub

### Step 1 — Connect GitHub to Shopify

1. Log in to **Shopify Admin** → go to **Online Store → Themes**.
2. Click **Add theme → Connect from GitHub**.
3. Authorize Shopify's GitHub app if prompted.
4. Select the repository **`CollinM01/dovy2359hj`**.
5. Select the branch **`naturalist-redesign`**.
6. Click **Connect branch**.

Shopify will pull the theme. Click **Preview** to inspect before publishing, or **Publish** when ready.

> **Note:** Every push to the `naturalist-redesign` branch will be available to pull/sync inside Shopify Admin.

### Step 2 — ZIP upload (alternative)

1. Click the green **Code** button on the repository and choose **Download ZIP**.
2. In Shopify Admin → **Online Store → Themes**, click **Add theme → Upload zip file**.
3. Upload the downloaded ZIP.

---

## Required Metafields Setup

These metafields power the Product Detail Page (PDP) accordions. Create them in **Shopify Admin → Settings → Custom data → Products**.

| Namespace & Key | Type | Used for |
|---|---|---|
| `custom.features` | Rich text | Features & Materials accordion |
| `custom.care` | Rich text | Care Instructions accordion |
| `custom.shipping` | Rich text | Shipping & Returns (overrides theme setting) |
| `custom.fit_notes` | Rich text | *(optional)* Fit & sizing notes |
| `custom.materials` | Rich text | *(optional)* Material composition detail |
| `custom.origin` | Single line text | *(optional)* Country/region of origin |
| `custom.size_guide` | Page reference | *(optional)* Links to a size guide page |

### How to add a metafield definition

1. Go to **Shopify Admin → Settings → Custom data**.
2. Under **Products**, click **Add definition**.
3. Set **Name** (e.g. "Features"), **Namespace and key** (e.g. `custom.features`), **Type** = Rich text.
4. Save. Now edit any product to fill in the field.

### Global fallback for shipping

If a product does not have `custom.shipping` set, the theme falls back to the **Theme Settings** value:

1. Go to **Online Store → Themes → Customize**.
2. Under **Theme settings → Policies**, enter your default shipping & returns text.

---

## Collection Handles for Shop Tabs

The Shop collection page (`/collections/`) shows four tabs. You **must create these collections** in Shopify with the exact handles below:

| Tab label | Collection handle | URL |
|---|---|---|
| All | `all` | `/collections/all` *(Shopify built-in)* |
| Hoodies | `hoodies` | `/collections/hoodies` |
| Sweatshirts | `sweatshirts` | `/collections/sweatshirts` |
| T-Shirts | `t-shirts` | `/collections/t-shirts` |

### How to create a collection with the correct handle

1. Go to **Shopify Admin → Products → Collections → Create collection**.
2. Enter the title (e.g. "Hoodies").
3. Scroll to **Search engine listing** and set the handle to exactly `hoodies` (lowercase, no spaces).
4. Save.

> The "All" collection (`/collections/all`) is a Shopify system collection — it automatically includes every product and requires no setup.

---

## Variant Option Names

Product variants **must use these exact option names** (case-sensitive) for swatches and size selectors to render correctly:

- **`Color`** — renders as circular color swatches
- **`Size`** — renders as pill/button size selectors

Any other option name renders as a standard `<select>` dropdown.

---

## Design System

### Palette
| Token | Default Hex | Use |
|-------|-------------|-----|
| `--color-paper` | `#F5F0E8` | Page background |
| `--color-bark` | `#2C1F14` | Primary / CTAs / headings |
| `--color-sage` | `#6B7C61` | Secondary / accents |
| `--color-fog` | `#D4CFC4` | Borders / dividers |
| `--color-ink` | `#3D3228` | Body text |
| `--color-cream` | `#FAF7F2` | Card surfaces |
| `--color-moss` | `#4A5E3A` | Conservation / hover |

All colors are editable via **Online Store → Themes → Customize → Theme settings → Colors**.

### Typography
- **Display / Headings:** Cormorant Garamond (loaded from Google Fonts)
- **Body / UI:** Jost (loaded from Google Fonts)

---

## Key Sections

| Section | Description |
|---------|-------------|
| `hero-naturalist` | Full-viewport hero with subtle zoom/drift animation |
| `marquee-ticker` | Scrolling announcement marquee |
| `featured-products-grid` | Collection-driven product grid (pick any collection) |
| `story-strip` | Two-column image + editorial text (Mel & Atlas story) |
| `conservation-banner` | Full-bleed conservation CTA |
| `newsletter-naturalist` | Email signup form |
| `main-product-naturalist` | Full PDP: sticky gallery, Color swatches, Size selector, metafield accordions |
| `main-collection-naturalist` | Collection page with tab navigation |
| `page-about` | Brand story with editable profile cards (Atlas & Peabody) |
| `page-conservation` | Conservation values with editable value cards |
| `cart-drawer` | AJAX slide-in cart drawer |
| `quick-view-modal` | Quick-view product modal (loaded via section rendering) |

---

## JavaScript Architecture

All JS is **vanilla ES2020+**, no bundler required. Custom elements are used throughout:

- `<accordion-component>` — smooth max-height accordion
- `<cart-drawer>` — slide-in cart with sections API
- `<product-form>` — variant selection + ATC with fetch
- `<product-media-gallery>` — sticky gallery + thumbnail keyboard navigation
- `<quick-view-modal>` — product modal via `?section_id=quick-view-modal`
- `<predictive-search>` — debounced suggest.json integration
- `<marquee-component>` — CSS-driven infinite scroll ticker
- `<quantity-input>` — +/− stepper

---

## Local Development

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