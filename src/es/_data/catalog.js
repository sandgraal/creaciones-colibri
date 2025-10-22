const baseCatalog = require("../../_data/catalog");
const productTranslations = require("../../_data/i18n/products.es.json");

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
    default:
      return name;
  }
};

const translateProduct = (product, categoryName) => {
  const translation = productTranslations[product.id] || {};
  const dietary = translation.dietary || product.dietary || [];
  const benefits = translation.benefits || product.benefits || [];

  return {
    ...product,
    name: translation.name || product.name,
    shortDescription: translation.shortDescription || product.shortDescription,
    description: translation.description || product.description,
    unit: translation.unit || product.unit,
    ingredients: translation.ingredients || product.ingredients,
    dietary,
    benefits,
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
