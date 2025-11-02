# Checkout QA Checklist

Before launching or after significant updates, run through this list to ensure Snipcart checkout behaves as expected.

## Pre-flight
- [ ] `.env` contains a valid `SNIPCART_PUBLIC_KEY` (test mode for staging).
- [ ] Snipcart dashboard test mode is enabled.
- [ ] Shipping rates and taxes match `docs/operations/shipping.md`.

> **2025-11-02 status:** Shipping matrix + tax guidance finalized, but sandbox API keys are still pending. All checkout scenarios below remain blocked until the dashboard credentials arrive.

## Tests
1. **Domestic order (USA)**
   - [ ] Add a single product to the cart from catalog card.
   - [ ] Update quantity on product detail page and verify cart reflects the change.
   - [ ] Complete checkout with Stripe test card (`4242 4242 4242 4242`).
   - [ ] Confirm order appears in Snipcart dashboard with correct totals and shipping rate.

2. **International order**
   - [ ] Add multiple products and proceed to checkout using a non-US address.
   - [ ] Verify international shipping tier applies.
   - [ ] Complete payment in test mode and confirm data (address, notes) carries over.

3. **Discount code**
   - [ ] Create a promo code in Snipcart dashboard.
   - [ ] Apply it in cart and ensure totals update correctly.

4. **Cart persistence**
   - [ ] Add items, refresh the page, and confirm cart retains contents (Snipcart auto-handles storage).

5. **Cancel flow**
   - [ ] From checkout, cancel the payment and confirm redirect to `/checkout/cancel/`.

6. **Success flow**
   - [ ] After successful payment, confirm redirect to `/checkout/success/` and email receipt content.

## Performance & Accessibility Log
- [x] Run the asset audit script (`npm run audit:assets`) and record the totals below.
- [ ] Capture Lighthouse scores for home, products, bundles, and Spanish landing pages (`npm run audit:lighthouse`). Attach reports in `docs/operations/performance-reports/`.
- [ ] Note any accessibility issues discovered during keyboard or screen-reader spot checks. Create follow-up tickets as needed.

```
- Date: 2025-10-23
- Asset totals (raw / gzip): 492 KB / 122 KB (see `docs/operations/performance-reports/2025-10-23-asset-audit.md`)
- Lighthouse scores (P / A / BP / SEO): pending — run after Snipcart sandbox stabilizes
- Notes & remediation:
  - Largest assets are `css/main.css` (30 KB raw / 4.5 KB gz) and catalog indexes (`products/index.html`, `es/productos/index.html`).
  - Revisit bundle/product templates if Lighthouse flags layout shift or interaction delays.

```

``` 
- 2025-11-02 – QA by automation partner. Checkout tests blocked; awaiting Snipcart + PayPal sandbox credentials before running the matrix documented in `docs/operations/snipcart-test-plan.md`.
```

## Post-test
- [ ] Clear test orders from Snipcart dashboard.
- [ ] Switch dashboard out of test mode and update `.env` with live public key.
- [ ] Re-run a single live transaction when production-ready.

Record completion and notes:

```
- 2024-07-__ – QA by ______ (notes)
```
