# SEO & Metadata Checklist

## Defaults
- Global metadata lives in `src/_data/siteMeta.js`:
  - `title`
  - `description`
  - `url`
  - `socialImage` (used for Open Graph & Twitter cards)
- Update these values when the production domain or branding changes.

## Page-specific Metadata
- Individual pages can set `title` and `description` in front matter.
- The layout combines them as `{{ title }} · {{ siteMeta.title }}` and falls back to the global description.
- Add `socialImage` in front matter if a page needs a unique preview image.

## Sitemap & Robots
- `src/sitemap.xml.njk` auto-generates a sitemap using `siteMeta.url`.
- `src/robots.txt.njk` references the sitemap. Update once the production domain changes.

## Action Items Before Launch
- [ ] Confirm `SITE_URL` `.env` value matches the live domain.
- [ ] Provide high-resolution Open Graph image at `siteMeta.socialImage`.
- [ ] Review localized pages to ensure descriptions are meaningful per language.
