# AGENT.md

## 1. Purpose
Defines the autonomous agent system for the **Creaciones Colibrí** site.  
Agents manage creative, operational, and publishing workflows using GitHub Actions automation inside a static Eleventy build pipeline.

---

## 2. Agent Directory

Authoritative documentation for each agent lives under [`/agents`](./agents/README.md). Every agent must maintain a dedicated subdirectory with a README derived from the [agent template](./agents/README.template.md).

| Agent Name | Role | Trigger | Linked Script/Workflow |
|-------------|------|----------|------------------------|
| `colibri-content` | Builds and updates site pages, product catalog, and blog content | On push to `main` | `.github/workflows/pages.yml` |
| `colibri-image` | Generates and optimizes product and post images for responsive use | Manual or scheduled | `scripts/image-optimize.mjs` *(conceptual placeholder)* |
| `colibri-packaging` | Produces product label exports and template renders | On commit to `/assets/labels/` | `scripts/package-render.mjs` *(conceptual placeholder)* |
| `colibri-data` | Syncs product metadata between JSON/YAML and Eleventy collections | On change to `/src/_data/` | `src/_data/products.js` |
| `colibri-analytics` | Aggregates static build and traffic metrics into `/data/metrics.json` | Nightly | `.github/workflows/pages.yml` (extendable) |
| `colibri-chat` | Optional bilingual assistant for on-site help | Disabled (no backend) | N/A |

---

## 3. Capabilities Matrix
Each agent defines:
- **Inputs:** files, data directories, or user commits.  
- **Outputs:** rendered pages, optimized assets, or logs.  
- **Execution Context:** GitHub Actions VM using Node.js 20.  
- **Fallback:** Rollback via prior commit; artifacts always generated from `main`.

---

## 4. Interaction Protocol
Agents communicate through:
- File-based signaling (`_data/agents.json`).  
- GitHub Actions logs and PR annotations.  
- Optional workflow artifacts (`dist/`, `_site-eleventy/`).

All agents must:
- Produce deterministic outputs.  
- Avoid overwriting user-authored Markdown or templates.  
- Tag AI-generated data with:
  ```yaml
  ai-generated: true
  ```

---

## 5. Autonomy & Oversight
- Agents execute independently through GitHub Actions triggers.  
- Human review occurs only through PR review or manual artifact validation.  
- Conflicts resolved by deterministic file precedence (data → layout → asset).

---

## 6. Data Boundaries
- No data leaves GitHub or local build.  
- Secrets stored via `Repository Settings → Secrets and Variables`.  
- Only `actions/deploy-pages@v4` can publish to production.  
- Agents must not invoke external APIs without explicit configuration.

---

## 7. Deployment
- Build runs `npm ci && npm run build` per `.github/workflows/pages.yml`.  
- Eleventy outputs `_site-eleventy/`, deployed via Pages artifact.  
- To extend automation, add `.github/workflows/agents.yml` referencing new agents.

Example:
```yaml
name: Colibri Agents
on:
  schedule:
    - cron: "0 3 * * *"
jobs:
  content-refresh:
    uses: ./.github/workflows/pages.yml
```

---

## 8. Contributing Agents
When adding or updating an agent:
1. Use prefix `colibri-<role>`.  
2. Include a README in `/agents/<role>/README.md` based on [`agents/README.template.md`](./agents/README.template.md).
3. Register it in `_data/agents.json`:
   ```json
   { "name": "colibri-image", "status": "active", "last_run": "2025-10-23" }
   ```
4. Test locally with `npm run build` before committing.  
5. Ensure outputs are reversible through Git commit history.

---

## 9. References
- `.github/workflows/pages.yml` — core CI/CD definition.  
- `docs/operations/deployment-runbook.md` — hosting and deployment notes.  
- `src/_data/products.js` — agent data model.  
- `README.md` — developer setup instructions.

---

## 10. Versioning
This file defines the **baseline agent manifest v1.0**.  
Subsequent updates should include version history within this file or in `CHANGELOG.md`.
