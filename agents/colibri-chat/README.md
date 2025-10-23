# Colibrí Chat Agent

> Placeholder for a bilingual customer-support assistant once backend infrastructure is available.

## Overview
- **Identifier:** `colibri-chat`
- **Status:** disabled
- **Primary Trigger:** None (feature paused)
- **Owner:** Customer Experience (future)

## Responsibilities
- Maintain architectural notes for a future chat assistant capable of Spanish/English support.
- Track third-party options (Intercom, Drift, custom serverless) and required privacy considerations before implementation.
- Coordinate with analytics to measure chat engagement once activated.

## Workflows
- No automated workflows currently exist. When revived, hook into `ai/.github/workflows/agents.yml` with a dedicated agent command.

## Configuration
- Pending integration details. Expect environment variables for chat provider keys and localization assets when scoped.

## Observability
- None yet. Future implementation should include logging, analytics events, and escalation paths to human agents.

## Runbook
1. **Activation planning:** Revisit customer support goals and choose a chat provider or custom build.
2. **Implementation:** Add the provider SDK or embed script within `src/_includes/layouts/base.njk`, respecting localization and privacy requirements.
3. **Monitoring:** Define SLAs, escalation workflows, and update the analytics plan with new events.
4. **Review:** Update this document and register the agent in `_data/agents.json` when moving from disabled to active.

## Change History
| Date | Change | Author |
|------|--------|--------|
| 2025-10-24 | Documented placeholder scope and future activation steps | Automation Team |

---

*Based on `agents/README.template.md`; expand when the customer-support roadmap is funded.*
