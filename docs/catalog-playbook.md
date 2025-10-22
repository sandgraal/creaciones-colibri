# Catalog Playbook

Use this guide when adding or updating products so the Eleventy data layer stays consistent and accessible.

## 1. Product Data Conventions

Products live in `src/_data/products.js` as an array of objects. Each entry should provide:

| Field | Required | Notes |
| ----- | -------- | ----- |
| `id` | ✅ | Kebab-case identifier used for URLs (e.g., `sunrise-citrus-granola`). |
| `name` | ✅ | Display name. Keep it under ~40 characters for card layouts. |
| `category` | ✅ | Matches a catalog grouping (Hot Sauces, Granola & Crunch, Wellness Pantry, etc.). |
| `price` | ✅ | Number without currency symbol. |
| `unit` | ✅ | Packaging descriptor (e.g., `5 oz bottle`, `12 oz bag`). |
| `shortDescription` | ✅ | 1–2 sentences for cards (~160 characters). |
| `description` | ✅ | Longer story for detail page; highlight sourcing and usage ideas. |
| `ingredients` | ✅ | Ordered list for detail view; use title case. |
| `dietary` | Optional | Array of lowercase tags (e.g., `vegan`, `gluten-free`). |
| `benefits` | Optional | Array of lowercase functional tags (`anti-inflammatory`, `hydration-support`). |
| `heatLevel` | Optional | Integer 0–5 for sauce heat meter. |
| `image.src` | ✅ | Path under `/img/`. Prefer `.webp` or optimized PNG. |
| `image.alt` | ✅ | Descriptive alt text. |
| `labels` | Optional | Array of short badges shown on cards (e.g., `"Bundle"`, `"Subscription"`). |
| `includedHeading` | Optional | Heading override for the “What’s inside” section on detail pages. |
| `includedProducts` | Optional | Array of objects (`id`, `name`, `note`, optional `quantity`) describing bundle contents. |
| `bundleExtrasHeading` | Optional | Heading override for bundle perks on detail pages. |
| `bundleExtras` | Optional | Array of strings listing bundle perks or extras. |
| `subscription` | Optional | Object with `heading`, `frequency`, `summary`, `perks` (array), and `renewalNote` for subscription products. |
| `shippingNote` | Optional | Text block shown at the end of the detail page for fulfillment context. |

Update the Eleventy build with `npm run build` after edits to confirm URLs render.

## 2. Imagery Workflow

1. Export images at multiple widths (480px, 960px) and save in `src/img/` using descriptive snake_case names.
2. Convert to modern formats (`.webp` or optimized `.png`). Keep file sizes under 250 KB when possible.
3. Document alt text in the `image.alt` field; describe context, not color alone (e.g., "Jar of Selva Noche Cashew Butter with cacao nibs and cashews.").
4. If multiple variants exist (e.g., lifestyle vs. product shot), store them in a product folder (`src/img/products/ID/`).

## 3. Pricing & Logistics Notes

- Prices in the data file are for storefront display; maintain a separate spreadsheet for raw cost, margin, and wholesale considerations.
- Include packaging unit in `unit` so customers know the size (e.g., `6 sachets`, `9 oz jar`).
- When shipping rules are finalized, document them in `docs/operations/shipping.md` (to be created) and reference within marketing copy.

## 4. Adding New Categories

- Use descriptive category names that align with navigation labels.
- After introducing a category, update any internal links (home page buttons, filters) that reference the slug.
- Slugs are auto-generated using the category name; keep names concise to produce readable URLs.

## 5. Review Checklist

Before opening a PR:

- [ ] Ran `npm run build` with no Eleventy errors.
- [ ] Verified catalog listing and detail pages render the new product.
- [ ] Spot-checked card layout for overflow or text wrapping issues.
- [ ] Updated `implementation_plan.md` if this work satisfies a checklist item.
- [ ] Added assets to `docs/design/` or linked references if creative direction changed.

## 6. Bundles & Subscriptions

- Bundle data lives in `src/_data/bundles.js`. Each entry mirrors product fields (`id`, `name`, `shortDescription`, `description`, `price`, `unit`) and adds:
  - `type`: `bundle` for one-time sets or `subscription` for recurring offerings.
  - `contents`: array of `{ productId, quantity, notes? }`. `productId` should match an existing entry in `products.js` so templates can render localized names.
  - `perks`: bullet points surfaced on the detail page (keep to short benefit statements).
  - `translations`: optional locale overrides (e.g., Spanish copy) using the same shape as the base fields.
- Images for bundles live in `src/img/bundles/`. Follow the same SVG-first approach as products to keep the repo lightweight.
- The listing page (`src/bundles/index.njk` and `src/es/suscripciones/index.njk`) and detail templates (`src/bundles/bundle.njk`, `src/es/suscripciones/bundle.njk`) pull directly from the data file. Update translations and perks whenever bundle contents change so both locales stay in sync.
- Snipcart buttons automatically appear for `type: bundle` entries when `SNIPCART_PUBLIC_KEY` is configured. Subscription entries now render Snipcart subscription buttons using their `billing.interval` and `billing.intervalCount`; include optional `billing.trialDays` if you plan to offer a trial. When Snipcart isn’t configured locally, templates still fall back to the email CTA so preview builds remain informative.

Keeping this playbook current ensures new contributors can extend the catalog without reverse-engineering existing entries.
