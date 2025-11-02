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

- Brand assets now live in the repository-level `logo/` directory and are copied to `/img/logo/` at build time (configured in `.eleventy.js`).
- Header and hero treatments use the raster exports (`creaciones_colibri_logo-1x1-*.{avif,webp,jpg,png}` and `creaciones_colibri_logo-16x9-*.{avif,webp,jpg}`) depending on the layout.
- Browser icons rely on the generated PNG set (`32w`, `64w`, `192w`, `512w`); regenerate these sizes from the 640px master if the source artwork changes.
- Update `src/site.webmanifest.njk` and `src/_includes/layouts/base.njk` when adding, renaming, or resizing icons so the manifest, favicons, and Apple touch icons stay accurate.
- Safari pinned tabs use the monochrome SVG (`creaciones_colibri_mask-icon.svg`) that lives alongside the other logo assets; update it when the mark changes and keep the `<link rel="mask-icon">` tag in `src/_includes/layouts/base.njk` pointing at the latest path.

Document updates here when new assets replace placeholders:

```
- 2024-07-__ – Replaced mango_guava_fire.svg with lifestyle photo (who/notes)
```
