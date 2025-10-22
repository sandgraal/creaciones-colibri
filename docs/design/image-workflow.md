# Image Workflow & Placeholders

This guide explains how we manage product imagery while we gather final photography.

## 1. Placeholder Strategy
- Each product uses an SVG gradient stored in `src/img/products/`. The filenames match the product IDs for clarity.
- SVGs are lightweight, responsive, and compatible with our Eleventy build; replace them with `.webp` or optimized `.png` assets when final photos are available.
- Keep descriptive alt text in `src/_data/products.js` even for placeholders so assistive technologies convey context.

## 2. Replacing with Final Photography
1. Export product shots at multiple widths (e.g., 480px, 960px, 1440px) and convert to `.webp`.
2. Place the files in `src/img/products/` and update the `image.src` path in the corresponding product entry.
3. The `responsiveImage` shortcode (powered by Eleventy Image) will automatically generate responsive `webp/jpeg` variants—no need to hand-write `srcset` attributes.

## 3. Optimization Tips
- Use [Squoosh](https://squoosh.app/) or `cwebp` CLI for compression.
- Target file sizes under 200 KB for hero imagery and under 150 KB for product cards.
- Maintain consistent framing (centered product on neutral background) to reinforce brand cohesion.

## 4. Favicon & Logo Variants
- Brand assets live in `src/img/branding/`.
- `creaciones-colibri-logo.svg` powers the hero, header, and Open Graph fallbacks.
- Browser icons currently rely on SVG exports (`creaciones-colibri-logo.svg` and `maskable-icon.svg`) so the repository stays text-only. When production-ready raster icons are approved, generate them during the build pipeline (e.g., with `sharp`) or host them on the CDN before wiring them into the layout.
- Update `src/site.webmanifest.njk` and `src/_includes/layouts/base.njk` if you add or rename icons so the manifest and link tags stay accurate.
- Safari pinned tabs read from `maskable-icon.svg`; keep paths synchronized with the `<link rel="mask-icon">` tag in `src/_includes/layouts/base.njk`.

Document updates here when new assets replace placeholders:
```
- 2024-07-__ – Replaced mango_guava_fire.svg with lifestyle photo (who/notes)
```
