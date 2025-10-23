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
- `scripts/log-agent-run.mjs` appends structured JSON log entries to
  `logs/agent-run.log`, capturing metadata such as the agent name and GitHub
  run identifier.

Both scripts rely on Node.js 20+, matching the runtime of the production
Pages workflow.

## GitHub Workflows

Three reusable workflows ship with the kit and are scoped to the `ai/`
directory:

- **`AI Agents` (`ai/.github/workflows/agents.yml`)** — orchestrates one or
  more agents selected via workflow dispatch input. Each agent runs in its own
  matrix job, bootstraps the toolkit, and logs start/completion events to
  `ai/logs/agent-run.log`.
- **`Changelog Snapshot` (`ai/.github/workflows/changelog.yml`)** — generates a
  markdown summary of recent commits. Provide optional `from`/`to` refs to
  shape the range or leave blank to capture the latest 20 commits.
- **`Sync README Archive` (`ai/.github/workflows/readme-sync.yml`)** — packages
  the current toolkit into an `ai-template-kit.zip` artifact. If a prior
  archive is available it compares the README snapshot before bundling;
  otherwise it simply produces a fresh download. The zip artifact is published
  for convenience and is not stored in the repository.

Reference these workflows from repository-level automation or trigger them via
the Actions tab as needed.

## Getting Started

1. Review `.chatgpt-context.yml` and `site-config.json` to ensure values match
   the current project state.
2. Call `node ai/scripts/bootstrap.mjs` locally or in CI to verify the kit is
   wired correctly.
3. Trigger `AI Agents` from GitHub Actions with `agent=all` once the workflows
   are connected, then inspect `ai/logs/agent-run.log` for run metadata.

As you build out additional agents, add their documentation under `ai/AGENTS.md`
or create per-agent subdirectories to keep instructions organized.
