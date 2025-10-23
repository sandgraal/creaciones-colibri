# Agents Directory

This directory contains per-agent definitions, documentation, and supporting assets for the Creaciones Colibrí automation system.

## Layout

Each agent lives in its own subdirectory named after the agent identifier (for example, `colibri-content/`). Inside each agent directory you should provide:

- `README.md` — a description of the agent's purpose, triggers, inputs, and outputs.
- `config/` *(optional)* — configuration files, workflow fragments, or secrets templates.
- `scripts/` *(optional)* — helper scripts executed by the agent's workflow.
- `assets/` *(optional)* — static files generated or consumed by the agent.

Additional documentation, such as runbooks or decision logs, can be added as needed.

## Getting Started

1. Copy the [Agent README template](./README.template.md) into your new agent directory.
2. Rename placeholders and fill in the required sections.
3. Register the agent in `_data/agents.json` and update automation workflows as needed.

Refer to `AGENTS.md` at the repository root for the authoritative agent manifest and contribution guidelines.
