# Colibrí Packaging Agent

> Produces product label exports and packaging templates aligned with shipping and compliance guidelines.

## Overview
- **Identifier:** `colibri-packaging`
- **Status:** pending
- **Primary Trigger:** Commits touching `/assets/labels/` (to be introduced) or manual dispatch via `AI Agents`
- **Owner:** Maintainership (Christopher & Codex)

## Responsibilities
- Transform catalog data from `src/_data/products.js` into printable label specs (ingredients, allergens, net weight).
- Generate CSV/JSON exports for fulfillment partners based on packaging matrices in `docs/operations/shipping.md`.
- Track revisions to label copy so regulatory changes propagate consistently across batches.
- Prepare packaging checklists for new product launches, coordinating with sustainable material vendors documented in the shipping guide.

## Workflows
- **Label export:** `node scripts/package-render.mjs --format=csv --out=ai/_state/labels.csv` creates a latest-state label manifest.
- **Future automation:** Extend `ai/.github/workflows/agents.yml` with an `assets/labels/` path filter once the directory is committed.
- **Manual QA:** Use the checklist in `docs/operations/shipping.md` to confirm shipping tiers match packaging assumptions before distributing new labels.

## Configuration
- **Output directory:** `ai/_state/` stores generated manifests; add Git LFS or cloud storage later if binary exports become large.
- **Customization flags:**
  - `--fields=id,name,unit,ingredients` to tailor the export columns.
  - `--format=json` when partner systems expect structured JSON instead of CSV.
- **Source data:** Supplements `src/_data/products.js` with any overrides stored in future `/assets/labels/config/` files.

## Observability
- **Command output:** Displays total products processed and export path confirmations.
- **AI agent log:** Manual or automated runs append to `ai/logs/agent-run.log` with status metadata.
- **Partner feedback:** Document fulfillment issues or corrections in `docs/operations/shipping.md` for traceability.

## Runbook
1. **Prepare data:** Confirm `src/_data/products.js` reflects the latest ingredient and allergen updates.
2. **Generate export:** Run `node scripts/package-render.mjs` with the appropriate format/fields and store the artifact in `ai/_state/`.
3. **Review output:** Spot-check label entries for accuracy (unit sizes, ingredient ordering) and jot any corrections in the shipping guide.
4. **Distribute:** Upload files to the label printer or fulfillment portal; capture the date and batch in `docs/operations/shipping.md`.
5. **Archive:** Commit large exports to a storage system or attach to the relevant task ticket; keep the repository free of binary artifacts.

## Change History
| Date | Change | Author |
|------|--------|--------|
| 2025-10-24 | Drafted initial packaging workflow documentation and export script usage | Project maintainers |

---

*Based on `agents/README.template.md`; update when label templates and automated triggers go live.*
