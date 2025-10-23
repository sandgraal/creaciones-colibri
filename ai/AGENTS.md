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

| Agent | Purpose | Primary Trigger | Key Steps |
| --- | --- | --- | --- |
| `colibri-content` | Regenerate product, bundle and blog content or refresh localized strings. | Manual dispatch via **AI Agents** workflow. | Runs Eleventy build prerequisites, validates product data, prepares content diffs for review. |
| `colibri-image` | Produce or optimize product and blog imagery for responsive breakpoints. | Manual dispatch via **AI Agents** workflow (select agent). | Calls design tooling (future), enforces naming conventions, writes optimized assets to `src/img/`. |
| `colibri-packaging` | Render printable packaging templates and label exports. | Manual dispatch via **AI Agents** workflow. | Uses packaging templates (future) and exports PDFs/SVGs into `assets/labels/`. |
| `colibri-data` | Synchronize structured data (`src/_data/`, `docs/operations/`) with downstream consumers. | Manual dispatch via **AI Agents** workflow. | Checks schema parity, runs translation cache updates, writes consolidated JSON exports. |
| `colibri-analytics` | Aggregate telemetry and monitoring snapshots (Plausible, Lighthouse) for reporting. | Manual dispatch via **AI Agents** workflow. | Gathers metrics, updates `docs/operations/performance-reports/`, posts summaries. |

> **Status:** All agents currently execute placeholder steps that log their runs.
> Expand each agent with concrete scripts or integrations as automation matures.

> **Automation note:** The `AI Agents` workflow reads this manifest to decide
> which commands to run. Only agents marked `active` with a configured
> `command` execute automatically; entries flagged as `pending` or `disabled`
> are reported in the workflow summary as skipped.

## Existing Helpers
- **Bootstrap:** `node ai/scripts/bootstrap.mjs` ensures directories exist and
  prints the active configuration pulled from `site-config.json`.
- **Manifest-driven runs:** `node ai/scripts/run-agent.mjs` reads
  `ai/agents/manifest.json` to decide which agents to execute, supports dry
  runs vs. `--execute`, and appends structured results to
  `ai/logs/agent-run.log`.
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
