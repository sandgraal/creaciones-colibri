# Asset Audit — 23 October 2025

We ran `npm run audit:assets` against the current Eleventy build to capture a weight baseline before the first Lighthouse review.

## Summary
- **Total files audited:** 50
- **Raw size:** 492 KB
- **Gzipped size:** 122 KB
- **Largest asset:** `css/main.css` at 30 KB raw / 4.5 KB gzipped.
- **Notable HTML pages:** `products/index.html` (27 KB raw / 4.1 KB gzipped) and `es/productos/index.html` (21 KB raw / 3.8 KB gzipped).

Totals by extension:

| Extension | Files | Raw size | Gzipped size |
| --- | --- | --- | --- |
| .html | 42 | 416 KB | 103 KB |
| .js | 3 | 37 KB | 12 KB |
| .css | 1 | 30 KB | 4.5 KB |
| .json | 2 | 7.4 KB | 2.6 KB |
| .webmanifest | 2 | 1.4 KB | 709 B |

## Next Steps
- Run Lighthouse on home, products, bundles, and `/es/` landing once Snipcart sandbox scripts are stable.
- Log resulting scores and any remediation items in `docs/operations/qa-checklist.md`.
- Monitor `css/main.css` and product index pages; they are the largest assets and prime candidates for future optimizations if scores drop.
