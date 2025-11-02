# AI Agent Directory

This manifest tracks AI-enabled workflows scoped to the `ai/` directory. It
provides context for automation that supports the Creaciones Colibrí site.

## Agent Lifecycle
1. Document each agent in this file or link out to a dedicated README under
   `ai/agents/<agent-name>/`.
2. Define the agent's triggers inside `ai/.github/workflows/` and reference
   shared helpers from `ai/scripts/`.
3. Persist run metadata using `scripts/log-agent-run.mjs` so results can be
   audited later.

## Agent Catalog

| Agent | Status | Command | Triggers | Description |
| --- | --- | --- | --- | --- |
| `colibri-content` | `active` | `npm run build` | `.github/workflows/pages.yml`, manual dispatch via `ai/.github/workflows/agents.yml` | Builds the Eleventy site and publishes GitHub Pages artifacts. |
| `colibri-image` | `active` | `node scripts/image-optimize.mjs --strict --report=ai/_state/image-report.json` | Manual dispatch via `ai/.github/workflows/agents.yml` | Audits storefront imagery for optimization and missing derivatives. |
| `colibri-packaging` | `pending` | `node scripts/package-render.mjs --format=csv --out=ai/_state/labels.csv` | Path trigger: `assets/labels/` | Generates packaging label exports for fulfillment partners. |
| `colibri-data` | `active` | `npm run translate` | Path trigger: `src/_data/`, manual dispatch via `ai/.github/workflows/agents.yml` | Keeps catalog and translation data synchronized before builds. |
| `colibri-analytics` | `active` | `npm run audit:assets` | Nightly schedule, manual dispatch via `ai/.github/workflows/agents.yml` | Captures performance baselines and validates analytics integrations. |
| `colibri-chat` | `disabled` | _n/a_ | _n/a_ | Placeholder for a future bilingual support assistant. |

> **Activation guidance:** To promote a `pending` or `disabled` agent, align it
> with the catalog above: implement or verify the documented command, update the
> manifest `status` to `active`, confirm triggers exist (workflow, path, or
> schedule), and add run expectations following the subsections below. Run
> `node ai/scripts/run-agent.mjs --execute --agent <name>` to validate before
> committing the updated manifest and documentation.

> **Automation note:** The `AI Agents` workflow reads this manifest to decide
> which commands to run. Only agents marked `active` with a configured
> `command` execute automatically; entries flagged as `pending` or `disabled`
> are reported in the workflow summary as skipped.

### `colibri-content` (`active`)

- **Expected inputs:** Product catalog data in `src/_data/products.js`, Eleventy
  layouts/collections in `src/_includes`, and blog/product content authored per
  Phase 1 foundations and localization deliverables.
- **Generated artifacts:** Runs `npm run build` to compile `_site-eleventy/`
  assets and Pages deployment bundles defined in the deployment & CI tasks.
- **Validation & rollback:** Confirm the Eleventy build succeeds in GitHub
  Pages workflows, review diff outputs, and fall back via the documented
  deployment rollback procedures.
- **Implementation plan links:**
  - [Phase 1 — Foundation & Content](../implementation_plan.md#phase-1--foundation--content-week-1-2)
  - [Phase 3 — Localization](../implementation_plan.md#phase-3--enhancements--marketing-week-5-6)
  - [Phase 3 — Deployment & CI](../implementation_plan.md#phase-3--enhancements--marketing-week-5-6)

### `colibri-image` (`active`)

- **Expected inputs:** Source imagery organized in `src/img/` and workflow
  documentation captured during the Phase 1 visual design tasks.
- **Generated artifacts:** Optimization reports written to
  `ai/_state/image-report.json` and refreshed responsive assets in `src/img/`
  per the image optimization workflow.
- **Validation & rollback:** Inspect the generated report, compare asset sizes
  against the documented baseline, and restore previous images via version
  control if optimization fails or regresses quality.
- **Implementation plan links:**
  - [Phase 1 — Define product catalog](../implementation_plan.md#phase-1--foundation--content-week-1-2)
  - [Phase 1 — Visual design](../implementation_plan.md#phase-1--foundation--content-week-1-2)

### `colibri-data` (`active`)

- **Expected inputs:** Structured catalog, pricing, and translation sources in
  `src/_data/` along with localization milestones outlined for Phase 3.
- **Generated artifacts:** Runs `npm run translate` to refresh consolidated data
  exports that keep Eleventy collections and localized content in sync.
- **Validation & rollback:** Verify schema parity after translation syncs,
  ensure updated data passes Eleventy build checks, and revert changes from
  version control if mismatches surface.
- **Implementation plan links:**
  - [Phase 1 — Define product catalog](../implementation_plan.md#phase-1--foundation--content-week-1-2)
  - [Phase 3 — Localization](../implementation_plan.md#phase-3--enhancements--marketing-week-5-6)

### `colibri-analytics` (`active`)

- **Expected inputs:** Analytics configuration, Plausible toggles, and audit
  scripts established in the analytics and performance tasks.
- **Generated artifacts:** Executes `npm run audit:assets` to produce performance
  baselines and supporting reports tracked in `docs/operations/performance-*`.
- **Validation & rollback:** Compare new audit outputs against prior baselines,
  document follow-up tasks, and revert to the last known-good metrics if
  regressions are detected.
- **Implementation plan links:**
  - [Phase 3 — Analytics & SEO](../implementation_plan.md#phase-3--enhancements--marketing-week-5-6)
  - [Phase 3 — Performance & accessibility audit](../implementation_plan.md#phase-3--enhancements--marketing-week-5-6)

## Existing Helpers
- **Bootstrap:** `node ai/scripts/bootstrap.mjs` ensures directories exist and
  prints the active configuration pulled from `site-config.json`.
- **Manifest-driven runs:** `node ai/scripts/run-agent.mjs` reads
  `ai/agents/manifest.json` to decide which agents to execute, supports dry
  runs vs. `--execute`, and appends structured results to
  `ai/logs/agent-run.log`.
- **Log summaries:** `node ai/scripts/report-status.mjs` (or `npm run
  ai:report`) aggregates the manifest and log history into a per-agent
  snapshot, with optional filters and JSON output for dashboards.
- **Standalone logging:** `node ai/scripts/log-agent-run.mjs` is available when
  bespoke scripts need to append entries manually.

## Next Steps
Populate this document with concrete agent instructions (e.g.,
`colibri-content`) as soon as automation stories are defined. Include:

- Inputs and outputs handled by the agent
- Default prompts or models required for generation
- How to validate or roll back the agent's changes

This keeps the AI toolkit aligned with the broader automation plan described
in the repository's root `AGENT.md`.
