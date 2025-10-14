const catalog = require("../../_data/catalog");

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

module.exports = {
  categories: catalog.categories.map(category => ({
    ...category,
    name: translateCategory(category.name)
  }))
};
