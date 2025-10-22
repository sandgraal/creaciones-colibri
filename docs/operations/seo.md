# SEO & Metadata Checklist

## Defaults
- Global metadata lives in `src/_data/siteMeta.js`:
  - `title`
  - `description`
  - `url`
  - `socialImage` (used for Open Graph & Twitter cards)
  - `socialImageAlt` (alt text reused for OG/Twitter and structured data)
  - `organization` (name, URL, logo, contact email, and social profiles for structured data)
- Update these values when the production domain or branding changes. If you add more social networks, append them to `organization.sameAs`.

## Page-specific Metadata
- Individual pages can set `title` and `description` in front matter.
- The layout combines them as `{{ title }} · {{ siteMeta.title }}` and falls back to the global description.
- Localized templates (e.g., files under `src/es/`) should include a language-specific `description` so Open Graph and Twitter cards match the locale.
- Global fallbacks can also be localized by editing `src/_data/siteMeta.js` → `locales`. Spanish metadata (title, description) powers Open Graph/Twitter defaults and the Spanish web manifest.
- Add `socialImage` in front matter if a page needs a unique preview image.
- Blog posts automatically set `og:type` to `article` and emit `article:published_time`/`article:modified_time` when an `updated` front matter value is present.
- Product detail pages expose `product:price` meta tags based on `site.snipcart.currency` and the product’s price.

## Structured Data
- The base layout now emits:
  - `WebSite` schema with publisher/organization details and localized language codes.
  - `BlogPosting` schema for posts tagged with `post` (includes author, publication dates, and canonical URL).
  - `Product` schema for catalog entries, including offers and dietary keywords.
- Keep `products.js` data accurate—price, dietary tags, and descriptions flow directly into schema markup.
- When adding new locales, confirm `SITE_LOCALE` / `SITE_ALT_LOCALES` so `inLanguage` stays correct.

## Sitemap & Robots
- `src/sitemap.xml.njk` auto-generates a sitemap using `siteMeta.url`.
- `src/robots.txt.njk` references the sitemap. Update once the production domain changes.

## Action Items Before Launch
- [ ] Confirm `SITE_URL` `.env` value matches the live domain.
- [ ] Provide high-resolution Open Graph image at `siteMeta.socialImage`.
- [ ] Review localized pages to ensure descriptions are meaningful per language.
- [ ] Verify that structured data validates in Google’s Rich Results Test after major content updates.
