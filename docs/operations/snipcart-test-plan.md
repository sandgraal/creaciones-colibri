# Snipcart QA & Configuration Log

Use this log to coordinate checkout configuration, tax/shipping rule updates, and QA runs. Update it every time settings change or a new test cycle completes.

## 1. Environment Snapshot

| Date | Tester | Public Key | Mode | Notes |
| ---- | ------ | ---------- | ---- | ----- |
| 2025-11-02 | Automation partner | Pending (`SNIPCART_PUBLIC_KEY` placeholder) | Test | Shipping + tax matrix documented; awaiting sandbox keys to enter settings. |

- **Currency:** USD
- **Default language:** `en` (override to `es` on `/es/` pages via `SNIPCART_LOCALE_MAP`)
- **Shipping tables:** Documented in `docs/operations/shipping.md`.
- **Payment gateways:** Stripe (primary), PayPal (secondary).

## 2. Configuration Checklist

Before running QA, confirm the following dashboard settings:

- [x] Shipping tables match the domestic + international configuration. _(Documented in `docs/operations/shipping.md`; ready to input once sandbox keys arrive.)_
- [ ] Stripe Tax (or manual 7% Florida tax) enabled with business address on file. _(Blocked — no dashboard access.)_
- [ ] Webhook endpoints disabled (or pointing to sandbox) during test runs.
- [ ] Success URL: `https://sandgraal.github.io/creaciones-colibri/checkout/success/`
- [ ] Cancel URL: `https://sandgraal.github.io/creaciones-colibri/checkout/cancel/`
- [ ] Abandoned cart emails disabled until production launch.

## 3. Test Matrix

Record each scenario in the table below. Attach supporting screenshots or exported receipts in `/docs/operations/performance-reports/` or a dedicated `/docs/operations/snipcart-artifacts/` folder.

| Date | Scenario | Result | Notes |
| ---- | -------- | ------ | ----- |
| 2025-11-02 | Domestic order – Stripe | Blocked | Waiting on sandbox keys to validate $8 flat rate + 7% tax. |
| 2025-11-02 | Domestic order – PayPal | Blocked | Cannot access PayPal sandbox credentials tied to Snipcart account. |
| 2025-11-02 | International order ≤1.1 kg | Blocked | Need Snipcart access to confirm $34.95 tier + customs prompts. |
| 2025-11-02 | International order 1.1–2.5 kg | Blocked | Pending credentials; verify $44.95 tier once dashboard is available. |
| 2025-11-02 | Subscription checkout | Blocked | Requires Snipcart sandbox plan configuration. |
| 2025-11-02 | Subscription renewal | Blocked | Simulated renewal only available after subscription test checkout. |
| 2025-11-02 | Checkout UI locale (es) | Blocked | Need checkout access to confirm locale mapping after enabling keys. |
| 2025-11-02 | Discount code | Blocked | Promo code creation blocked without dashboard access. |
| 2025-11-02 | Cancel flow | Blocked | Awaiting sandbox access to trigger cancel + redirect. |
| 2025-11-02 | Cart persistence | Blocked | Cart testing requires Snipcart scripts activated with valid key. |

### 3.1 Test Data

- **Stripe test card:** `4242 4242 4242 4242`, any future expiry, CVC `123`, ZIP `33101`.
- **PayPal sandbox:** Use the sandbox business + buyer accounts from our PayPal developer profile.
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

| Date | Logged By | Issue | Next Step |
| ---- | --------- | ----- | --------- |
| 2025-11-02 | Automation partner | Sandbox credentials unavailable. | Request Snipcart + PayPal test keys, then rerun the full matrix. |

## 5. Go-Live Checklist

Complete these items before switching out of test mode:

- [ ] Clear all test orders from Snipcart dashboard.
- [ ] Replace test API keys with live credentials in repository secrets and `.env` files.
- [ ] Re-run one live transaction (Stripe) to verify rates and receipts.
- [ ] Enable abandoned cart emails and confirm copy matches brand tone.
- [ ] Update `implementation_plan.md` with launch date and responsible owner.
