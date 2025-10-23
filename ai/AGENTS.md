# AGENTS.md

## Overview
This manifest tracks AI-enabled workflows scoped to the `ai/` directory. It
provides context for future agents that automate content, localization or
operational tasks for the Creaciones Colibrí site.

## Agent Lifecycle
1. Document each agent in this file or link out to a dedicated README under
   `ai/agents/<agent-name>/`.
2. Define the agent's triggers inside `ai/.github/workflows/` and reference
   shared helpers from `ai/scripts/`.
3. Persist run metadata using `scripts/log-agent-run.mjs` so results can be
   audited later.

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
Populate this document with concrete agents (e.g., `colibri-content-ai`) as
soon as automation stories are defined. Include:

- Inputs and outputs handled by the agent
- Default prompts or models required for generation
- How to validate or roll back the agent's changes

This keeps the AI toolkit aligned with the broader automation plan described
in the repository's root `AGENT.md`.
