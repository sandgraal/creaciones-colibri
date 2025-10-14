const products = require("./products");
const categories = {};

for (const product of products) {
  const key = product.category.toLowerCase().replace(/[^\w]+/g, "_").replace(/^_|_$/g, "");
  if (!categories[key]) {
    categories[key] = {
      id: key,
      name: product.category,
      products: []
    };
  }
  categories[key].products.push(product);
}

module.exports = {
  categories: Object.values(categories)
};
