module.exports = {
  snipcart: {
    publicKey: process.env.SNIPCART_PUBLIC_KEY || "",
    currency: process.env.SNIPCART_CURRENCY || "USD"
  },
  forms: {
    contactEndpoint: process.env.FORMSPREE_ENDPOINT || "",
    newsletterAction: process.env.NEWSLETTER_ACTION || ""
  }
};
