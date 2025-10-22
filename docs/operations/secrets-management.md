# Secrets Management Guidance

This playbook explains how to store and rotate the API keys, form endpoints, and other sensitive values used by the Creaciones Colibrí storefront.

## 1. Inventory of Secrets

| Secret | Purpose | Where it is used |
| ------ | ------- | ---------------- |
| `SNIPCART_PUBLIC_KEY` | Authenticates Snipcart checkout requests. | Injected into the base layout to load Snipcart scripts and populate the hidden `div#snipcart`. |
| `SNIPCART_CURRENCY` (optional) | Overrides Snipcart's default currency. | Passed to Snipcart configuration in templates. |
| `FORMSPREE_ENDPOINT` | Enables the contact form submission endpoint. | Read in `src/contact.njk` and `src/es/contacto.njk` to render the live form. |
| `NEWSLETTER_ACTION` | Configures the homepage newsletter form destination. | Used in `src/index.md` to post to the email provider. |
| `PLAUSIBLE_DOMAIN` | Activates the analytics shortcode. | Injected by `.eleventy.js` when present. |
| `SITE_URL` | Generates canonical URLs, sitemap entries, and SEO metadata. | Consumed in `src/_data/siteMeta.js` and Eleventy filters. |
| `SITE_LOCALE`, `SITE_ALT_LOCALES` | Control default locale and language switcher. | Read by `src/_data/site.js` to expose localization data. |
| `TRANSLATION_PROVIDER`, `DEEPL_API_KEY`, `DEEPL_SOURCE_LANG` | Enable machine translation workflow for product copy. | Used by translation scripts under `scripts/`. |

Track any new integrations in this table so operations knows which environments require updates.

## 2. Storage Locations

### Local Development
- Copy `.env.example` to `.env` and populate only the credentials you need for the task at hand.
- Never commit `.env` files. The repository `.gitignore` is configured to keep them out of version control—verify before pushing.
- If you demo features that require secrets, share temporary keys or use accounts created for development only.

### GitHub Actions / Pages
- Store production values in the repository’s **GitHub Actions secrets**. Required keys: `SNIPCART_PUBLIC_KEY`, `SITE_URL`, and any live form or analytics endpoints.
- Use the **Environment secrets** feature if you later introduce staging deployments. Prefix secrets with the environment name (e.g., `STAGING_SNIPCART_PUBLIC_KEY`).
- Document updates to secrets in pull request descriptions or `docs/operations/qa-checklist.md` when they affect launch-readiness.

### Third-Party Dashboards
- Restrict access to Snipcart, Plausible, and email marketing tools to the operations team. Create individual user accounts instead of sharing a master login.
- For shared credentials that cannot be federated, store them in a password manager (1Password, Bitwarden) with MFA enabled.

## 3. Rotation & Revocation
- Rotate API keys at least annually, or immediately after team changes.
- When rotating, update the value in all environments (local `.env`, GitHub secrets, deployment hosts) and trigger a rebuild so Eleventy receives the new value.
- Revoke unused keys in the provider dashboard to limit attack surface.

## 4. Auditing Checklist
- [ ] Review Git history quarterly to ensure no secrets were accidentally committed.
- [ ] Confirm GitHub Actions secrets match the latest provider dashboards.
- [ ] Verify `.env.example` stays up to date whenever new environment variables are introduced.
- [ ] Update this document if new services are added or existing ones are retired.

Keeping secrets disciplined protects customer data and ensures checkout, forms, and analytics stay online.
