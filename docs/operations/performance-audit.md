# Performance & Accessibility Audit Playbook

Use this guide whenever we prepare a release or introduce major UX changes. It pairs the new asset-weight report with manual Lighthouse checks so we can spot regressions early and document the results for the team.

## 1. Prerequisites
- Node.js 20+ installed locally.
- Chrome or Chromium browser for running Lighthouse (either via DevTools or the CLI).
- The repository cloned and dependencies installed (`npm install`).

## 2. Generate the asset baseline
Run the automated asset audit to capture current CSS/JS/HTML weights. This script rebuilds the site and prints raw/gzipped sizes for the largest files and file-type totals.

```bash
npm run audit:assets
```

Record the summary (especially total gzipped weight and the heaviest assets) in your release notes or in `docs/operations/qa-checklist.md` under the new performance section.

## 3. Run Lighthouse
Choose at least the following URLs for every audit cycle:
- `/creaciones-colibri/`
- `/creaciones-colibri/products/`
- `/creaciones-colibri/bundles/`
- `/creaciones-colibri/es/`

### Option A — Chrome DevTools
1. Build and serve locally with `npm start`.
2. Open Chrome DevTools → Lighthouse tab.
3. Run reports for **Performance**, **Accessibility**, **Best Practices**, and **SEO**.
4. Export the report as JSON or HTML. Store artifacts in `docs/operations/performance-reports/` (create the folder if it does not exist) and link them from the QA checklist.

### Option B — Lighthouse CLI
If you have `lighthouse` installed globally (or run via `npx`):

```bash
npm run build
npx lighthouse http://localhost:8080/creaciones-colibri/ --view --output=json --output-path=./docs/operations/performance-reports/home.json
```

Repeat for the other target URLs. When using the CLI, serve `_site-eleventy` locally (e.g., `npx http-server _site-eleventy`) or run against the staging deployment.

## 4. Accessibility spot checks
Beyond Lighthouse, run the following manual checks:
- Keyboard-only navigation across header, product cards, forms, and cart triggers.
- Screen-reader spot check (VoiceOver, NVDA, or JAWS) to ensure locale switcher and cart announcements read correctly.
- Color contrast verification whenever palette updates ship (refer to `docs/design/accessibility-review.md`).

Document findings and remediation tasks in `docs/operations/qa-checklist.md` so the backlog stays prioritized.

## 5. Logging & follow-up
- Update the **Performance & accessibility audit** section in `implementation_plan.md` with a short note (date, reviewer, next actions).
- Attach raw reports or summarized metrics to the QA checklist.
- Open issues for any regressions or action items uncovered by the audit.

Keeping this playbook updated ensures every release meets our performance and accessibility bar.
