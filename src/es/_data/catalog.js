const fs = require("fs");
const path = require("path");

const baseCatalog = require("../../_data/catalog");

const loadProductTranslations = () => {
  const candidates = [
    path.join(process.cwd(), ".cache", "i18n", "products.es.json"),
    path.join(process.cwd(), "src", "_data", "i18n", "products.es.overrides.json")
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        delete require.cache[require.resolve(candidate)];
        return require(candidate);
      }
    } catch (error) {
      console.warn(`[i18n] Failed to load ${candidate}: ${error.message}`);
    }
  }

  return {};
};

const productTranslations = loadProductTranslations();

const slugify = value =>
  value
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const translateCategory = name => {
  switch (name) {
    case "Hot Sauces":
      return "Salsas picantes";
    case "Granola & Crunch":
      return "Granolas y crujientes";
    case "Wellness Pantry":
      return "Despensa de bienestar";
    case "Bundles & Subscriptions":
      return "Paquetes y suscripciones";
    default:
      return name;
  }
};

const translateProduct = (product, categoryName) => {
  const translation = productTranslations[product.id] || {};
  const dietary = translation.dietary || product.dietary || [];
  const benefits = translation.benefits || product.benefits || [];
  const labels = translation.labels || product.labels || [];
  const includedHeading = translation.includedHeading || product.includedHeading;
  const includedProducts = translation.includedProducts || product.includedProducts || [];
  const bundleExtrasHeading = translation.bundleExtrasHeading || product.bundleExtrasHeading;
  const bundleExtras = translation.bundleExtras || product.bundleExtras || [];
  const subscription = translation.subscription || product.subscription || null;
  const shippingNote = translation.shippingNote || product.shippingNote;

  return {
    ...product,
    name: translation.name || product.name,
    shortDescription: translation.shortDescription || product.shortDescription,
    description: translation.description || product.description,
    unit: translation.unit || product.unit,
    ingredients: translation.ingredients || product.ingredients,
    dietary,
    benefits,
    labels,
    includedHeading,
    includedProducts,
    bundleExtrasHeading,
    bundleExtras,
    subscription,
    shippingNote,
    category: translateCategory(categoryName),
    url: `/es/productos/${product.id}/`
  };
};

const categories = baseCatalog.categories.map(category => {
  const translatedName = translateCategory(category.name);
  const products = category.products.map(product => translateProduct(product, category.name));

  return {
    ...category,
    name: translatedName,
    slug: slugify(translatedName),
    products
  };
});

const catalogProductsEs = categories.flatMap(category => category.products);

const buildTagList = arrays => {
  const tags = new Set();

  for (const values of arrays) {
    if (Array.isArray(values)) {
      for (const value of values) {
        if (value) {
          tags.add(value);
        }
      }
    }
  }

  return Array.from(tags)
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .map(tag => ({ tag, slug: slugify(tag) }));
};

const productCategoriesEs = categories.map(category => ({
  name: category.name,
  slug: category.slug,
  items: category.products
}));

const productDietaryTagsEs = buildTagList(catalogProductsEs.map(product => product.dietary));
const productBenefitTagsEs = buildTagList(catalogProductsEs.map(product => product.benefits));

module.exports = {
  catalog: {
    categories,
    dietaryTags: productDietaryTagsEs,
    benefitTags: productBenefitTagsEs
  },
  catalogProductsEs,
  productCategoriesEs,
  productDietaryTagsEs,
  productBenefitTagsEs
};
