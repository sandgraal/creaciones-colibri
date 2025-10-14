# Forms & Newsletter Setup

## Contact Form (Formspree)
- The contact form lives at `/contact/` and posts to Formspree when `FORMSPREE_ENDPOINT` is set in `.env` (example: `https://formspree.io/f/{id}`).
- **Steps:**
  1. Create a Formspree project and form endpoint.
  2. Add the endpoint to `.env` (`FORMSPREE_ENDPOINT`).
  3. Deploy; the contact page automatically renders the form. Without the env var, visitors see a fallback message with the support email.
- Add a webhook/email notification in Formspree to ensure responses land in the team inbox.

## Newsletter Signup
- The homepage newsletter block submits to whatever provider action you supply via `NEWSLETTER_ACTION` (e.g., Mailchimp form action, ConvertKit URL).
- **Steps:**
  1. Grab the provider’s form POST action URL for the list segment you want to use.
  2. Set `NEWSLETTER_ACTION` in `.env`.
  3. If the provider requires hidden fields (tags, API tokens), extend `src/index.md` with those fields as needed.

## Privacy Considerations
- Update the privacy policy to reflect data collection methods once the forms go live.
- Ensure double opt-in is enabled for newsletter platforms if required by CAN-SPAM/GDPR.
