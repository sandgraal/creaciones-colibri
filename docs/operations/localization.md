# Localization Guide

## Overview
- English (`en`) is the default locale served at `/`.
- Spanish (`es`) lives under `/es/` with its own Eleventy page (`src/es/index.njk`).
- Navigation shows an automatic language switcher using `SITE_ALT_LOCALES`.

## Adding Additional Pages
1. Create a directory `src/{locale}/` (e.g., `src/es/`) and add localized templates mirroring the English structure.
2. To translate shared copy, update the JSON files under `src/_data/i18n/`.
3. Reference translations in templates via `collections.i18n[0].data.i18n.{locale}`.
4. When localizing blog posts, keep shared front matter like `tags: [post]` so structured data and article metadata stay in sync across languages.

### Product Catalog
- English product data lives in `src/_data/catalog.js` (built from `products.js`).
- Run `npm run translate` (or any build command) to generate machine translations in `.cache/i18n/products.es.json`.
- Manual overrides stay in `src/_data/i18n/products.es.overrides.json`; they win over machine output when present.
- `src/es/_data/catalog.js` merges those translations and provides `catalogProductsEs` for detail pages.
- Spanish catalog listing: `src/es/productos/index.njk`
- Spanish product detail template: `src/es/productos/product.njk`
- Spanish blog index lives at `src/es/blog/index.njk` and localized posts mirror `src/blog/posts/...` (use `locale: es` in front matter).
- Spanish contact page: `src/es/contacto.njk` shares env-driven form endpoints; keep IDs consistent so navigation anchors work.

## Environment Variables
- `SITE_LOCALE`: default locale (fallback for pages without `locale` front matter).
- `SITE_ALT_LOCALES`: comma-separated list of alternate locales to show in the switcher.
- `TRANSLATION_PROVIDER`: which machine translation vendor to use (`deepl` supported today).
- `DEEPL_API_KEY`: API key for the DeepL translator (required when `TRANSLATION_PROVIDER=deepl`).
- `DEEPL_SOURCE_LANG`: optional source language override (defaults to English when omitted).
- `SNIPCART_DEFAULT_LANGUAGE`: default language passed to Snipcart when a page locale does not have an explicit mapping. Use `auto` to keep Snipcart’s stock language.
- `SNIPCART_LOCALE_MAP`: comma-separated list mapping Eleventy locales to Snipcart language codes (e.g., `es:es,fr:fr`). When omitted, Spanish storefronts automatically opt into Snipcart’s built-in `es` translations.

## Metadata & Manifests
- Global metadata translations live in `src/_data/siteMeta.js` under the `locales` key. Update `locales.es.description` (and other locales) so Open Graph/Twitter tags inherit the right language.
- The base layout automatically chooses the localized manifest: `/site.webmanifest` for the default locale and `/es/site.webmanifest` for Spanish. Update or add `{locale}/site.webmanifest.njk` when introducing new languages.

## Workflow Checklist
- [x] Translate homepage content (`src/es/index.njk`).
- [x] Duplicate additional pages (products, blog) as localization progresses.
- [x] Update SEO metadata (language-specific title/description) when launching.
- [ ] Review content with native speakers.
- [ ] Confirm Snipcart adopts the right locale on each translated page (configure via `SNIPCART_LOCALE_MAP`).
