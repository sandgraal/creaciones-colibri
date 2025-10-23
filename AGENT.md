# AGENTS.md

## 1. Purpose
Defines the autonomous agent system for the **Creaciones Colibrí** site.  
Agents manage creative, operational, and publishing workflows using GitHub Actions automation inside a static Eleventy build pipeline.

---

## 2. Agent Directory

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
