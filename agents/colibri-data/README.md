# Colibrí Data Agent

> Keeps product, bundle, and localization data synchronized across the Eleventy build.

## Overview
- **Identifier:** `colibri-data`
- **Status:** active
- **Primary Trigger:** Changes to `src/_data/` or `scripts/translate-products.js`
- **Owner:** Engineering & Data Stewardship

## Responsibilities
- Run `node scripts/translate-products.js` to generate and merge machine translations into `.cache/i18n/` before each Eleventy build.
- Validate that `src/_data/products.js`, `src/_data/bundles.js`, and localized overrides remain in sync with Spanish catalog data (`src/es/_data/`).
- Update `src/_data/agents.json` so the storefront’s automation status list reflects the latest agent health.
- Coordinate with `colibri-content` and `colibri-analytics` to ensure downstream builds consume fresh data.

## Workflows
- **Manual sync:** Execute `npm run translate` locally or via the `AI Agents` workflow (`ai/.github/workflows/agents.yml` with `agent=colibri-data`).
- **Pre-build hook:** `npm run build` and `npm run start` both invoke the translation script automatically before Eleventy executes.
- **Data QA:** Spot-check generated `.cache/i18n/products.es.json` entries against overrides in `src/_data/i18n/products.es.overrides.json`.

## Configuration
- **Environment variables:**
  - `TRANSLATION_PROVIDER`, `DEEPL_API_KEY`, `DEEPL_SOURCE_LANG` when using external translation services (`docs/operations/localization.md`).
- **Source files:** Primary catalog definitions live in `src/_data/products.js`; bundles in `src/_data/bundles.js`; navigation/metadata in `src/_data/siteMeta.js`.
- **Localization overrides:** Manual copy fixes live in `src/_data/i18n/` and should be version controlled alongside catalog edits.

## Observability
- **Console output:** `scripts/translate-products.js` logs each product processed and highlights overrides applied.
- **AI agent log:** Runs triggered via GitHub Actions append entries to `ai/logs/agent-run.log`.
- **Content review:** Monitor `docs/status/handoff-log.md` for outstanding localization reviews or data cleanup tasks.

## Runbook
1. **Detect changes:** Watch for product or translation updates in pull requests.
2. **Run translation sync:** Execute `npm run translate`; commit changes under `.cache/i18n/` only when automation requires them (otherwise keep build artifacts ignored).
3. **Verify data:** Open a product page in both locales to ensure copy, pricing, and dietary tags remain accurate.
4. **Update agent registry:** Adjust `src/_data/agents.json` with the latest status or last-run timestamp.
5. **Escalate issues:** Log blockers (e.g., translation provider outages) in `docs/status/handoff-log.md` and notify the localization owner.

## Change History
| Date | Change | Author |
|------|--------|--------|
| 2025-10-24 | Documented data synchronization flow and AI agent touchpoints | Automation Team |

---

*Based on `agents/README.template.md`; expand when additional data sources join the build.*
