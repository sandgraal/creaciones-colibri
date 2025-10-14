const baseCatalog = require("../../_data/catalog");
const productTranslations = require("../../_data/i18n/products.es.json");

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
  return {
    ...product,
    name: translation.name || product.name,
    shortDescription: translation.shortDescription || product.shortDescription,
    description: translation.description || product.description,
    unit: translation.unit || product.unit,
    ingredients: translation.ingredients || product.ingredients,
    dietary: translation.dietary || product.dietary,
    benefits: translation.benefits || product.benefits,
    category: translateCategory(categoryName)
  };
};

const categories = baseCatalog.categories.map(category => {
  const products = category.products.map(product => translateProduct(product, category.name));
  return {
    ...category,
    name: translateCategory(category.name),
    products
  };
});

const catalogProductsEs = categories.flatMap(category => category.products);

module.exports = {
  catalog: { categories },
  catalogProductsEs
};
