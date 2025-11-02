# Remaining Launch Tasks

## Commerce Finalization
- [ ] Finalize Snipcart tax and shipping rules once we lock the shipping-rate matrix. _(Shipping matrix documented 2025-11-02; awaiting Snipcart sandbox keys to enter settings.)_
- [ ] Execute the full Snipcart sandbox QA checklist after tax/shipping configuration is complete. _(Blocked until sandbox credentials are provisioned.)_

## Localization & Content
- [ ] Conduct a native Spanish tone/nuance review session (schedule with a trusted reviewer) and capture copy overrides.
- [ ] Implement the approved localization updates across templates and product content.

## Subscriptions & Bundles
- [ ] Implement subscription renewal workflows and test the end-to-end cycle.

## Analytics & Monitoring
- [x] Record initial asset weight baseline (2025-10-23) — see `docs/operations/performance-reports/2025-10-23-asset-audit.md`.
- [ ] Run Lighthouse performance audits on the stabilized staging build and document remediation items. _(Command: `npm run audit:lighthouse`)_.
- [x] Wire up Plausible analytics (script embed + client event tracking).
- [ ] Validate Plausible event capture on staging once the production domain is live.
