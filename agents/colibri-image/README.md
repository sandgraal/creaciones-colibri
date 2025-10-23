# Colibrí Image Agent

> Audits and prepares storefront imagery so product photography stays fast, consistent, and accessible.

## Overview
- **Identifier:** `colibri-image`
- **Status:** active
- **Primary Trigger:** Manual or scheduled runs via `AI Agents`
- **Owner:** Design & Marketing Ops

## Responsibilities
- Scan `src/img/` for new or updated assets and flag files that exceed size budgets or lack optimized counterparts (`docs/design/image-workflow.md`).
- Generate optimization reports and, when ready, invoke conversion pipelines to create `webp` variants for raster imagery.
- Keep bundle/product image metadata (`alt` text, aspect ratios) aligned with catalog entries in `src/_data/products.js`.
- Document changes or replacements in `docs/design/image-workflow.md` so stakeholders see the latest asset history.

## Workflows
- **Quality audit:** Run `node scripts/image-optimize.mjs --strict --report=ai/_state/image-report.json` locally or via the `AI Agents` workflow (`ai/.github/workflows/agents.yml`).
- **Publishing coordination:** Pair with `colibri-content` after large asset updates to ensure Eleventy rebuilds with the new images.
- **Future automation:** Extend the command with a conversion step once Sharp or another optimizer is introduced.

## Configuration
- **Thresholds:** Override the default 200 KB per-image limit using `--max-raw-kb=<value>`.
- **Report location:** Pass `--report=<path>` to persist JSON summaries (defaults to stdout when omitted).
- **Dependencies:** Script runs on Node.js 20+ with no external packages; optimization binaries (Sharp, ImageMagick) can be added later as needed.

## Observability
- **Console output:** Lists scanned files, missing `webp` derivatives, and oversized assets.
- **JSON report:** When `--report` is provided, writes structured data to `ai/_state/` for workflow artifacts or follow-up tooling.
- **AI agent log:** Executions triggered via GitHub Actions append to `ai/logs/agent-run.log` with status metadata.

## Runbook
1. **Kick off a scan:** Trigger `AI Agents → colibri-image` or run the script locally with the desired flags.
2. **Review issues:**
   - Create optimized replacements for entries under `missingWebp`.
   - Re-export large files under the `oversized` list following compression guidance in `docs/design/image-workflow.md`.
3. **Commit updates:** Add optimized assets, update product data if alt text changes, and document replacements in the image workflow doc.
4. **Rebuild site:** Coordinate with `colibri-content` to publish the refreshed assets.
5. **Archive reports:** Upload or attach the JSON report to the relevant design ticket for historical tracking.

## Change History
| Date | Change | Author |
|------|--------|--------|
| 2025-10-24 | Added optimization audit script integration and documentation | Automation Team |

---

*Based on `agents/README.template.md`; update when optimization pipelines evolve.*
