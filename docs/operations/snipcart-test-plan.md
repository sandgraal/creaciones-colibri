# Snipcart Test Notes (Placeholder)

Use this file to track progress when running the QA checklist in `docs/operations/qa-checklist.md`. Fill in the table as you execute each scenario.

| Date | Tester | Scenario | Result | Notes |
| ---- | ------ | -------- | ------ | ----- |
|      |        | Domestic order | Pending | Requires sandbox credentials (Stripe test card) |
|      |        | International order | Pending | Confirm USPS PMI rate pulls correctly |
|      |        | Discount code | Pending | Create promo code in dashboard |
|      |        | Cancel flow | Pending | Verify redirect to `/checkout/cancel/` |
|      |        | Success flow | Pending | Ensure email receipt content is correct |

### Blockers / Follow-ups
- Waiting on Snipcart sandbox API key (public + secret) to proceed with checkout QA.
- Need shipping rate table implemented in dashboard before executing shipping validation steps.
- Confirm Stripe test mode is enabled and credentials provided.

Record final handoff notes here once QA is complete.
