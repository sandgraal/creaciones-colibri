# AI Template Kit — Creaciones Colibrí

This directory contains the automation scaffolding for integrating AI-driven
agents with the Creaciones Colibrí Eleventy site. It packages reusable
configuration, GitHub Actions workflows and helper scripts that can be
expanded as new agents are added.

## Directory Map

```
ai/
├── .chatgpt-context.yml   # High-level project context shared with agents
├── site-config.json       # Machine-readable metadata for scripts/workflows
├── AGENTS.md              # Agent-specific documentation entry point
├── logs/                  # Runtime logs captured by workflows
├── _state/                # Persistent scratch space for agent runs
├── agents/                # Machine-readable manifest describing available agents
├── scripts/               # Node helpers used by the workflows
└── .github/workflows/     # Self-contained automation entry points
```

## Configuration Files

- **`.chatgpt-context.yml`** captures the core commands, directories and
  environment requirements that agents should respect.
- **`site-config.json`** mirrors that information in JSON so GitHub Actions
  and scripts can consume it easily.

Update both files whenever build commands, deployment workflows or required
secrets change.

## Helper Scripts

- `scripts/bootstrap.mjs` prepares local folders and prints a summary of the
  current configuration. Run it in CI prior to executing agent logic.
- `scripts/run-agent.mjs` loads `agents/manifest.json`, selects the requested
  agent(s), optionally executes their commands, and logs results to
  `logs/agent-run.log`.
- `scripts/log-agent-run.mjs` remains available for lightweight logging needs,
  though `run-agent.mjs` now handles most workflows automatically.

All scripts rely on Node.js 20+, matching the runtime of the production Pages
workflow.

## GitHub Workflows

Minimal placeholder workflows live in `ai/.github/workflows/`. These can be
symlinked or referenced from the main repository workflows when you begin to
orchestrate agents. Start by wiring `ai/.github/workflows/agents.yml` into a
repository-level workflow dispatch so you can trigger all agents with a
single Action run.

## Getting Started

1. Review `.chatgpt-context.yml` and `site-config.json` to ensure values match
   the current project state.
2. Call `node ai/scripts/bootstrap.mjs` locally or in CI to verify the kit is
   wired correctly.
3. Trigger `AI Agents` from GitHub Actions with `agent=all` once the workflows
   are connected. Use the `execute` input when you want to run commands instead
   of a dry run. Inspect `ai/logs/agent-run.log` for run metadata or download
   the workflow artifact for deeper analysis.

As you build out additional agents, add their documentation under `ai/AGENTS.md`
or create per-agent subdirectories to keep instructions organized.
