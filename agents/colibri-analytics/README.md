# Colibrí Analytics Agent

> Aggregates performance metrics and toggles privacy-friendly analytics tooling for the storefront.

## Overview
- **Identifier:** `colibri-analytics`
- **Status:** active
- **Primary Trigger:** Nightly schedule (future) or manual dispatch via `AI Agents`
- **Owner:** Analytics & Growth

## Responsibilities
- Run `npm run audit:assets` and `npm run audit:lighthouse` to capture performance baselines (`docs/operations/performance-audit.md`).
- Maintain Plausible analytics integration (`docs/operations/analytics-plan.md`), ensuring events fire correctly once credentials are available.
- Collate metrics into JSON reports under `docs/operations/performance-reports/` for historical tracking.
- Share findings and remediation tasks with Engineering through issues or `docs/status/remaining-tasks.md`.

## Workflows
- **Performance baseline:** Trigger `AI Agents → colibri-analytics` or run the scripts locally after each feature release.
- **Analytics verification:** Once Plausible is live, validate checkout/newsletter events in staging before enabling production tracking.
- **Report distribution:** Attach generated reports to the weekly growth sync or analytics channel with key takeaways.

## Configuration
- **Environment variables:**
  - `PLAUSIBLE_DOMAIN` to inject the analytics script (leave empty in staging until consent is confirmed).
- **Artifacts:** Lighthouse output is stored in `docs/operations/performance-reports/`; asset audits print to the console and should be logged in the same directory when relevant.
- **Dependencies:** `npm run audit:lighthouse` expects Chrome/Lighthouse CLI availability in the execution environment.

## Observability
- **Console output:** Asset audits and Lighthouse runs provide pass/fail status plus score tables.
- **AI agent log:** GitHub Action executions append to `ai/logs/agent-run.log` with timestamps and status.
- **Docs trail:** Update `docs/operations/analytics-plan.md` and `docs/status/handoff-log.md` with the latest audit dates and outstanding follow-ups.

## Runbook
1. **Schedule run:** Initiate via workflow dispatch or cron once the nightly job is enabled.
2. **Execute audits:**
   - Run `npm run audit:assets` to capture bundle sizes.
   - Run `npm run audit:lighthouse` (CI may require headless Chrome setup; note blockers if missing).
3. **Review results:** Commit or archive reports under `docs/operations/performance-reports/` and summarize key deltas.
4. **Check analytics:** Confirm Plausible events appear for checkout, newsletter, and contact flows when the environment variable is set.
5. **Escalate regressions:** File follow-up issues or document remediation tasks in `docs/status/remaining-tasks.md`.

## Change History
| Date | Change | Author |
|------|--------|--------|
| 2025-10-24 | Captured analytics/performance workflow responsibilities and runbook | Automation Team |

---

*Based on `agents/README.template.md`; revise when analytics tooling expands beyond Plausible.*
