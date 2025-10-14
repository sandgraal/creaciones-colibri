# Checkout Integration Evaluation

This document compares lightweight cart/checkout services that pair well with a static Eleventy storefront. It focuses on options mentioned in the roadmap plus considerations specific to Creaciones Colibrí (multi-product catalog, US + Costa Rica reach, sustainable brand story).

## Summary Table

| Service | Pricing Snapshot* | Integration Effort | Key Pros | Key Cons |
| ------- | ----------------- | ------------------ | -------- | -------- |
| **Snipcart** | 2% transaction fee + Stripe/PayPal costs (no monthly fee until > $500/mo orders) | Inject script & data attributes; configure product metadata JSON | Static-site friendly; multi-currency; supports subscriptions; cart UI shipped | Requires paid plan after $500/mo; branding removable on paid tier only |
| **Shopify Buy Button** | Shopify Basic $39/mo + 2.9% + $0.30 per transaction | Create products in Shopify, embed snippets | Robust inventory, multi-channel, shipping/analytics built-in | Monthly cost; admin in Shopify; limited cart styling without custom code |
| **Stripe Checkout** | 2.9% + $0.30 per successful card charge | Requires serverless backend or build-time price sync | No platform fee; supports one-time/subscription payments; global reach | Must build webhook handling, order management, tax/shipping logic |
| **PayPal Buttons** | 2.99% + fixed fee per transaction | Embed client-side JS buttons | Simple setup; brand trust; no monthly fee | Limited cart experience; poor subscription handling; PayPal-only payments |

_\*Rates are US-based as of July 2024. Check regional pricing for Costa Rica and currency conversions._

## Option Details

### Snipcart
- **Integration:** Add the Snipcart script and styles to the base layout, mark each purchase button with `data-item-*` attributes, or expose products via JSON for programmatic carts. Works seamlessly with Eleventy and static hosting.
- **Payments:** Uses Stripe, PayPal, Square, and others as gateways. Multi-currency support fits US and potential Costa Rica expansion (subject to gateway availability).
- **Features:** Real-time shipping calculators (with carrier APIs), discount codes, abandoned cart emails, subscriptions, inventory tracking via Snipcart dashboard or API.
- **Considerations:** 2% fee on top of payment processor; branding removable with growth plan (~$10/month). Requires adding shipping tables in Snipcart dashboard to match the strategy documented in `docs/operations/shipping.md`.

### Shopify Buy Button
- **Integration:** Requires Shopify store. Products and inventory managed in Shopify; Eleventy pages embed generated Buy Button script to render product cards/cart.
- **Payments:** Shopify Payments (Stripe-backed) with robust tax/shipping configuration and multi-currency. Handles compliance (PCI, GDPR).
- **Features:** Built-in analytics, discounts, shipping rate rules, integration with POS/social channels.
- **Considerations:** $39/month base cost + transaction fees; customizing the Buy Button cart UI is limited without additional JS overrides. Need to synchronize blog/catalog copy between Eleventy and Shopify.

### Stripe Checkout
- **Integration:** Define product prices in Stripe Dashboard, render checkout session via serverless function (Netlify Functions, Cloudflare Workers). Eleventy front-end calls the function to create sessions. Requires handling success/cancel pages.
- **Payments:** Supports cards, wallets (Apple Pay, Google Pay), and some bank redirects. Adds tax, coupon, and subscription support via Stripe Billing.
- **Considerations:** No extra platform fee. Must implement order fulfillment workflow (webhooks, inventory updates) and manage shipping rate logic in code. Adds backend maintenance overhead.

### PayPal Smart Buttons
- **Integration:** Include PayPal SDK, render buttons with product amount/currency. Works for single-item purchases or simple carts (requires custom logic for multi-item carts).
- **Payments:** PayPal balance, credit/debit; customers stay in PayPal ecosystem.
- **Considerations:** Limited cart UX; lacks subscription support without PayPal Subscriptions (separate setup). Some users avoid PayPal-only checkouts; no Apple/Google Pay.

## Recommendation

- **Primary choice:** **Snipcart + Stripe**  
  Balances ease of integration with growth features. Snipcart keeps the site static, respects the shipping strategy, and allows future subscriptions (Phase 3) without replatforming. Stripe gateway covers cards and wallets; PayPal can be added as secondary gateway.

- **Fallback option:** **Shopify Buy Button**  
  Suitable if inventory management, taxes, and compliance should be offloaded entirely, and the monthly fee is acceptable. Requires duplicating product data between Shopify and Eleventy or converting Eleventy site to consume Shopify Storefront API.

- **Defer:** Stripe Checkout and PayPal Buttons unless we build custom backend infrastructure or need PayPal-only payments.

## Next Steps

1. Create Snipcart account and configure Stripe as primary payment gateway. Add the public API key to `.env` (`SNIPCART_PUBLIC_KEY`).
2. Define shipping tables in Snipcart to match `docs/operations/shipping.md` (flat US rate, thresholds, international tiers).
3. Add Snipcart script and `div id="snipcart"` container to the base layout; expose product data attributes on catalog buttons.
4. Implement success/cancel pages (`/checkout/success`, `/checkout/cancel`) explaining order follow-up. ✅
5. Add QA checklist for checkout (test US order, international order, discount code).
