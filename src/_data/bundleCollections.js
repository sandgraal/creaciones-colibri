module.exports = () => {
  delete require.cache[require.resolve("./bundles")];
  const bundles = require("./bundles");
  const curated = [];
  const subscriptions = [];

  for (const bundle of bundles) {
    if (bundle.type === "subscription") {
      subscriptions.push(bundle);
    } else {
      curated.push(bundle);
    }
  }

  return { curated, subscriptions };
};
