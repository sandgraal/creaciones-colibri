# Performance & Accessibility Audit Playbook

Use this guide whenever we prepare a release or introduce major UX changes. It pairs the asset-weight report with automated Lighthouse checks so we can spot regressions early and document the results for the team.

## 1. Prerequisites
- Node.js 20+ installed locally.
- Chrome or Chromium browser for running Lighthouse (either via DevTools or the CLI).
- Lighthouse CLI available globally (`npm install -g lighthouse`) or via your package manager.
- The repository cloned and dependencies installed (`npm install`).

## 2. Generate the asset baseline
Run the automated asset audit to capture current CSS/JS/HTML weights. This script rebuilds the site and prints raw/gzipped sizes for the largest files and file-type totals.

```bash
npm run audit:assets
```

Record the summary (especially total gzipped weight and the heaviest assets) in your release notes or in `docs/operations/qa-checklist.md` under the new performance section.

## 3. Run Lighthouse
`npm run audit:lighthouse` automates the Lighthouse workflow by rebuilding the site, serving `_site-eleventy` locally, and invoking the Lighthouse CLI for the standard set of URLs.

```bash
npm run audit:lighthouse
```

Reports are saved in `docs/operations/performance-reports/<timestamp>-lighthouse/` with both JSON + HTML artifacts and a Markdown summary. The script looks for a local Lighthouse CLI installation; if the binary is missing or Chrome/Chromium is unavailable, it exits with a helpful message so you can install the prerequisites and re-run.

To extend coverage (e.g., add blog posts or checkout flows), set the `LIGHTHOUSE_TARGETS` environment variable before running the script. Provide a comma-separated list of `<label>:<path>` entries relative to the GitHub Pages prefix:

```bash
LIGHTHOUSE_TARGETS="home:,products:products,checkout:checkout/success" npm run audit:lighthouse
```

The script automatically prefixes each entry with `/creaciones-colibri/` so the URLs match production.

### Manual alternative
If you prefer an interactive run, you can still open Chrome DevTools → Lighthouse or execute the CLI manually. Be sure to store the resulting reports under `docs/operations/performance-reports/` and update the QA checklist with the new scores.

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
