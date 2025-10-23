const locale = process.env.SITE_LOCALE || "en";
const alternateLocales = Array.from(
  new Set(
    (process.env.SITE_ALT_LOCALES || "en,es")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean)
  )
);

const parseLocaleMapping = value => {
  if (!value) {
    return {};
  }

  return value
    .split(",")
    .map(entry => entry.trim())
    .filter(Boolean)
    .reduce((accumulator, entry) => {
      const [pageLocale, language] = entry.split(":").map(part => part.trim());
      if (pageLocale && language) {
        accumulator[pageLocale] = language;
      }
      return accumulator;
    }, {});
};

const snipcartLocaleMap = parseLocaleMapping(process.env.SNIPCART_LOCALE_MAP);
const plausibleDomain = (process.env.PLAUSIBLE_DOMAIN || "").trim();

if (!process.env.SNIPCART_LOCALE_MAP) {
  // Ensure Spanish storefronts fall back to Snipcart's built-in es locale by default.
  snipcartLocaleMap.es = "es";
}

module.exports = {
  analytics: {
    plausibleDomain,
    enabled: Boolean(plausibleDomain)
  },
  snipcart: {
    publicKey: process.env.SNIPCART_PUBLIC_KEY || "",
    currency: process.env.SNIPCART_CURRENCY || "USD",
    defaultLanguage: process.env.SNIPCART_DEFAULT_LANGUAGE || "en",
    localeMap: snipcartLocaleMap
  },
  forms: {
    contactEndpoint: process.env.FORMSPREE_ENDPOINT || "",
    newsletterAction: process.env.NEWSLETTER_ACTION || ""
  },
  locale,
  alternateLocales
};
