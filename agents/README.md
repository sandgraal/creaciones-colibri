# Agents Directory

This directory contains per-agent definitions, documentation, and supporting assets for the Creaciones Colibrí automation system.

## Layout

Each agent lives in its own subdirectory named after the agent identifier (for example, `colibri-content/`). Inside each agent directory you should provide:

- `README.md` — a description of the agent's purpose, triggers, inputs, and outputs.
- `config/` *(optional)* — configuration files, workflow fragments, or secrets templates.
- `scripts/` *(optional)* — helper scripts executed by the agent's workflow.
- `assets/` *(optional)* — static files generated or consumed by the agent.

Additional documentation, such as runbooks or decision logs, can be added as needed.

## Registered Agents
| Agent | Status | Trigger | Notes |
|-------|--------|---------|-------|
| [`colibri-content`](./colibri-content/README.md) | Active | Push to `main` via `.github/workflows/pages.yml` | Rebuilds the Eleventy storefront and publishes GitHub Pages artifacts. |
| [`colibri-image`](./colibri-image/README.md) | Active | Manual or scheduled (`AI Agents` workflow) | Audits product imagery and prepares optimization reports. |
| [`colibri-packaging`](./colibri-packaging/README.md) | Pending | Future commits under `/assets/labels/` | Generates packaging label exports for fulfillment partners. |
| [`colibri-data`](./colibri-data/README.md) | Active | Changes to `src/_data/` or translation scripts | Syncs catalog data and localization assets before builds. |
| [`colibri-analytics`](./colibri-analytics/README.md) | Active | Nightly schedule (planned) or manual dispatch | Captures performance/analytics baselines and validates Plausible events. |
| [`colibri-chat`](./colibri-chat/README.md) | Disabled | N/A | Placeholder for future bilingual support assistant. |

> Manifest status drives automation. The `AI Agents` workflow executes only the
> entries marked **Active** with a defined command; other statuses remain
> visible in summaries but do not run until promoted.

## Getting Started

1. Copy the [Agent README template](./README.template.md) into your new agent directory.
2. Rename placeholders and fill in the required sections.
3. Register the agent in `_data/agents.json` and update automation workflows as needed.

Refer to `AGENT.md` at the repository root for the authoritative agent manifest and contribution guidelines.
