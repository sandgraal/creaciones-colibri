# Analytics & Monitoring Plan

This plan outlines how we will introduce privacy-friendly analytics and basic monitoring once credentials are available.

## 1. Plausible Analytics (Recommended)
- **Why:** lightweight, GDPR-friendly, no cookies by default. Works well with static sites.
- **Setup Steps:**
  1. Create a site in [Plausible](https://plausible.io/) for the production domain (`creaciones-colibri.com` or GitHub Pages URL).
  2. Copy the JavaScript snippet domain (e.g., `creaciones-colibri.com`) and set it in `.env` as `PLAUSIBLE_DOMAIN`.
  3. Deploy; Eleventy injects the script automatically via the `analytics` shortcode when the env var is present.
  4. Enable goal tracking inside Plausible for events like `checkout_started` and `order_completed` (Snipcart webhooks can trigger custom events later).

- **Staging:** Leave `PLAUSIBLE_DOMAIN` empty in staging `.env` files to avoid recording test traffic.

## 2. Snipcart Metrics
- Use Snipcart’s dashboard for revenue, conversion, and abandoned cart metrics.
- Optional: integrate Snipcart webhooks with a serverless endpoint (Netlify Functions, AWS Lambda) to log events or push into analytics tools. Add a ticket when ready.

## 3. Monitoring
- **Uptime:** Consider using services such as Uptime Robot or Better Stack for URL monitoring once the site runs on a custom domain.
- **Performance:** Schedule quarterly Lighthouse audits; document results in `docs/operations/qa-checklist.md` or a dedicated performance log.

## 4. Privacy & Consent
- Update the privacy policy when analytics go live. Note that Plausible is cookie-free; no cookie banner required unless future tools add cookies.
- If additional trackers are added (e.g., Meta Pixel, Google Analytics), revisit consent requirements.

## TODOs
- [ ] Create Plausible account and site (owner).
- [ ] Add `PLAUSIBLE_DOMAIN` to production `.env` once domain is finalized.
- [ ] Configure optional goals/webhooks.
- [ ] Review and finalize the privacy policy in `docs/legal/privacy.md` before launch.
