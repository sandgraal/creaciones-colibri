# Snipcart Setup Checklist

Follow these steps to connect Snipcart to the Eleventy storefront.

## 1. Create Snipcart Account & Store
- Sign up at [snipcart.com](https://snipcart.com) and create a new store.
- In the dashboard, navigate to **Account → API Keys** and copy the **Public API Key**. Paste it into the project `.env` file as `SNIPCART_PUBLIC_KEY`.
- (Optional) Set `SNIPCART_CURRENCY` if you prefer a default other than USD.
- To localize the checkout UI, set `SNIPCART_DEFAULT_LANGUAGE` (defaults to `en`) and map Eleventy locales to Snipcart languages with `SNIPCART_LOCALE_MAP` (e.g., `es:es`). Spanish pages fall back to Snipcart’s native Spanish strings automatically when no map is provided.

## 2. Payment Gateways
- Enable **Stripe** (recommended) under **Store settings → Payments → Gateways**. Connect the existing Stripe account or create a new one.
- Add PayPal as a secondary gateway if desired; Snipcart supports multiple providers concurrently.

## 3. Subscription Plans
- Enable the **Subscriptions** feature in Snipcart (requires the Pro plan or higher) so recurring items can charge automatically.
- Our Eleventy templates pass `data-plan-id="plan-<bundle.id>"` with interval details from `bundles.js`. Add the first subscription to your cart in test mode to let Snipcart create the plan automatically.
- In the Snipcart dashboard under **Products → Subscriptions**, confirm the generated plan name, price, and cadence match the bundle configuration. Adjust trial periods by updating `billing.trialDays` in `bundles.js` if needed.

## 4. Shipping Configuration
- Go to **Store settings → Shipping** and configure rates to match `docs/operations/shipping.md`:
  - Flat $8 domestic shipping; free over $75 order value.
  - Add USPS Priority Mail International tier (~$35) for lightweight international packages.
  - Include custom handling fee if compostable packaging cost should be recovered.
- Enable live carrier rates only if you have negotiated USPS/UPS accounts; otherwise stick with table rates for predictable pricing.

## 5. Taxes & Compliance
- In **Store settings → Taxes**, add the states/regions where you have nexus (currently Florida). Enable automatic tax calculation via Stripe Tax or manually set rates.
- Provide legal business information under **Billing → Invoices** so receipts include required details.

## 6. Email & Notifications
- Customize transactional emails (order confirmation, shipping updates) to match brand tone. Reference the messaging captured in `src/checkout/success.njk`.
- Add hola@creacionescolibri.com as the reply-to address so customers can respond directly.

## 7. Redirects & Webhooks
- Set checkout redirect URLs:
  - Success: `https://sandgraal.github.io/creaciones-colibri/checkout/success/`
  - Cancellation: `https://sandgraal.github.io/creaciones-colibri/checkout/cancel/`
- Optional: configure webhooks (under **Store settings → Webhooks**) to notify a fulfillment service or spreadsheet.

## 8. QA Checklist
- Enable **Test mode** in Snipcart and complete the scenarios outlined in `docs/operations/qa-checklist.md`. Use sandbox cards (Stripe: `4242 4242 4242 4242`, PayPal sandbox accounts) and record outcomes in the checklist.
- Once satisfied, disable test mode, clear test orders, and switch the API key in `.env` if Snipcart provided separate live credentials. Capture the go-live date and responsible operator in the log below.

Document the date of completion and any deviations here:

```
- 2024-07-?? – Setup completed by ______ (notes)
```
