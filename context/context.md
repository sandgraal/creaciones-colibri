# Repository Context

## Project Summary
- Static Eleventy storefront for Creaciones Colibrí with bilingual (English/Spanish) content, Snipcart-powered commerce, and blog/marketing pages.
- Product data, bundles, and locale metadata are sourced from `src/_data/` modules and rendered through Nunjucks templates under `src/`.
- Automation scripts support translation caching, asset and Lighthouse audits, and future AI agents for content/data tasks.

## Dependency Graph (High Level)
- Node.js 20 runtime
  - `@11ty/eleventy` (static site generation)
  - `@11ty/eleventy-img` (image optimization utilities)
  - `fuse.js` (client-side search indexing)
- Custom Node scripts in `scripts/` for translation, performance reporting, Lighthouse, and packaging exports.
- Snipcart embedded cart/checkout (activated via `SNIPCART_PUBLIC_KEY`).

## Commands Map
- Development: `npm run start` (runs translation sync then `eleventy --serve`).
- Build: `npm run build` (translates content and runs Eleventy static build).
- Translation cache refresh: `npm run translate`.
- Performance baseline: `npm run audit:assets`.
- Lighthouse automation: `npm run audit:lighthouse` (requires Chrome/Lighthouse CLI).
- AI agent runner: `npm run ai:run` / status reporter `npm run ai:report`.
- Image audit: `npm run images:audit`; packaging export: `npm run packaging:export`.

## Key Paths by Feature
- Layouts & partials: `src/_includes/` (base templates, components).
- Product catalog data: `src/_data/products.js`, `src/_data/catalog.js`, `src/_data/bundles.js`.
- Localization: `src/_data/i18n/`, localized pages under `src/es/` and locale-aware templates in `src/`.
- Commerce integrations: Snipcart buttons/scripts within `src/products/`, `src/bundles/`, and checkout pages under `src/checkout/`.
- Client search/filter logic: `src/js/search.js`, Eleventy-generated index `src/search.json.njk`.
- Operations documentation: `docs/operations/` (shipping, QA, Snipcart setup, performance audits).
- Automation agents: `agents/` definitions and `ai/` scripts.

## Known Constraints & Feature Flags
- Snipcart sandbox credentials (`SNIPCART_PUBLIC_KEY`, `SNIPCART_TEST_SECRET`) not yet provisioned—checkout automation and QA blocked.
- Shipping/tax matrices finalized in docs but pending Snipcart configuration.
- Plausible analytics requires `PLAUSIBLE_DOMAIN`; event verification pending production domain.
- Lighthouse audit automation depends on local Chrome/CLI availability (`npm run audit:lighthouse`).
- Forms and newsletter actions gated by `FORMSPREE_ENDPOINT` and `NEWSLETTER_ACTION` environment variables (disabled by default).
- Translation provider optional via `TRANSLATION_PROVIDER` and associated keys; currently manual review outstanding.
