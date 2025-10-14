# Snipcart Setup Checklist

Follow these steps to connect Snipcart to the Eleventy storefront.

## 1. Create Snipcart Account & Store
- Sign up at [snipcart.com](https://snipcart.com) and create a new store.
- In the dashboard, navigate to **Account → API Keys** and copy the **Public API Key**. Paste it into the project `.env` file as `SNIPCART_PUBLIC_KEY`.
- (Optional) Set `SNIPCART_CURRENCY` if you prefer a default other than USD.

## 2. Payment Gateways
- Enable **Stripe** (recommended) under **Store settings → Payments → Gateways**. Connect the existing Stripe account or create a new one.
- Add PayPal as a secondary gateway if desired; Snipcart supports multiple providers concurrently.

## 3. Shipping Configuration
- Go to **Store settings → Shipping** and configure rates to match `docs/operations/shipping.md`:
  - Flat $8 domestic shipping; free over $75 order value.
  - Add USPS Priority Mail International tier (~$35) for lightweight international packages.
  - Include custom handling fee if compostable packaging cost should be recovered.
- Enable live carrier rates only if you have negotiated USPS/UPS accounts; otherwise stick with table rates for predictable pricing.

## 4. Taxes & Compliance
- In **Store settings → Taxes**, add the states/regions where you have nexus (currently Florida). Enable automatic tax calculation via Stripe Tax or manually set rates.
- Provide legal business information under **Billing → Invoices** so receipts include required details.

## 5. Email & Notifications
- Customize transactional emails (order confirmation, shipping updates) to match brand tone. Reference the messaging captured in `src/checkout/success.njk`.
- Add hola@creacionescolibri.com as the reply-to address so customers can respond directly.

## 6. Redirects & Webhooks
- Set checkout redirect URLs:
  - Success: `https://sandgraal.github.io/creaciones-colibri/checkout/success/`
  - Cancellation: `https://sandgraal.github.io/creaciones-colibri/checkout/cancel/`
- Optional: configure webhooks (under **Store settings → Webhooks**) to notify a fulfillment service or spreadsheet.

## 7. QA Checklist
- Enable **Test mode** in Snipcart and complete the scenarios outlined in `docs/operations/qa-checklist.md`.
- Once satisfied, disable test mode, clear test orders, and switch the API key in `.env` if Snipcart provided separate live credentials.

Document the date of completion and any deviations here:

```
- 2024-07-?? – Setup completed by ______ (notes)
```
