# Snipcart QA & Configuration Log

Use this log to coordinate checkout configuration, tax/shipping rule updates, and QA runs. Update it every time settings change or a new test cycle completes.

## 1. Environment Snapshot

| Date | Tester | Public Key | Mode | Notes |
| ---- | ------ | ---------- | ---- | ----- |
|      |        |            | Test |                                       |

- **Currency:** USD
- **Default language:** `en` (override to `es` on `/es/` pages via `SNIPCART_LOCALE_MAP`)
- **Shipping tables:** Documented in `docs/operations/shipping.md`.
- **Payment gateways:** Stripe (primary), PayPal (secondary).

## 2. Configuration Checklist

Before running QA, confirm the following dashboard settings:

- [ ] Shipping tables match the domestic + international configuration.
- [ ] Stripe Tax (or manual 7% Florida tax) enabled with business address on file.
- [ ] Webhook endpoints disabled (or pointing to sandbox) during test runs.
- [ ] Success URL: `https://sandgraal.github.io/creaciones-colibri/checkout/success/`
- [ ] Cancel URL: `https://sandgraal.github.io/creaciones-colibri/checkout/cancel/`
- [ ] Abandoned cart emails disabled until production launch.

## 3. Test Matrix

Record each scenario in the table below. Attach supporting screenshots or exported receipts in `/docs/operations/performance-reports/` or a dedicated `/docs/operations/snipcart-artifacts/` folder.

| Date | Scenario | Result | Notes |
| ---- | -------- | ------ | ----- |
|      | Domestic order – Stripe | Pending | Verify $8 flat rate under $75; confirm tax amount. |
|      | Domestic order – PayPal | Pending | Ensure PayPal flow returns to success URL. |
|      | International order ≤1.1 kg | Pending | Expect $34.95 shipping, no domestic tax. |
|      | International order 1.1–2.5 kg | Pending | Verify $44.95 tier and customs fields. |
|      | Subscription checkout | Pending | Add Granola subscription, confirm plan auto-creates. |
|      | Subscription renewal | Pending | Use Snipcart dashboard to simulate renewal (run once plan exists). |
|      | Discount code | Pending | Apply promo and ensure totals update. |
|      | Cancel flow | Pending | Cancel payment and ensure cancel page renders copy in both locales. |
|      | Cart persistence | Pending | Reload page; cart contents remain via Snipcart storage. |

### 3.1 Test Data

- **Stripe test card:** `4242 4242 4242 4242`, any future expiry, CVC `123`, ZIP `33101`.
- **PayPal sandbox:** Use business + buyer accounts created under operations email alias.
- **International address:**
  - Name: Paula Rojas
  - Address: Avenida Central, Barrio Escalante
  - City: San José
  - Province: San José
  - Postal code: 10101
  - Country: Costa Rica

### 3.2 Subscription Notes

- Ensure the subscription item includes `data-plan-id`, `data-plan-interval`, and `data-plan-amount` attributes (handled in `src/bundles/bundle.njk`).
- After first successful checkout in test mode, verify plan in **Products → Subscriptions** and trigger “Simulate renewal” to confirm recurring charge amount.
- Document any Snipcart billing emails in this log.

## 4. Issues & Follow-ups

Track outstanding tasks discovered during QA.

| Date | Owner | Issue | Next Step |
| ---- | ----- | ----- | --------- |
|      |       |       |           |

## 5. Go-Live Checklist

Complete these items before switching out of test mode:

- [ ] Clear all test orders from Snipcart dashboard.
- [ ] Replace test API keys with live credentials in repository secrets and `.env` files.
- [ ] Re-run one live transaction (Stripe) to verify rates and receipts.
- [ ] Enable abandoned cart emails and confirm copy matches brand tone.
- [ ] Update `implementation_plan.md` with launch date and responsible owner.
