const locale = process.env.SITE_LOCALE || "en";
const alternateLocales = Array.from(
  new Set(
    (process.env.SITE_ALT_LOCALES || "en,es")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)
  )
);

module.exports = {
  snipcart: {
    publicKey: process.env.SNIPCART_PUBLIC_KEY || "",
    currency: process.env.SNIPCART_CURRENCY || "USD"
  },
  forms: {
    contactEndpoint: process.env.FORMSPREE_ENDPOINT || "",
    newsletterAction: process.env.NEWSLETTER_ACTION || ""
  },
  locale,
  alternateLocales
};
