const path = require("path");
const generateImage = require("./.eleventy.images");

const getProducts = () => {
  delete require.cache[require.resolve("./src/_data/products.js")];
  return require("./src/_data/products.js");
};

const slugifyString = value =>
  value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/fuse.js/dist/fuse.min.js": "js/vendor/fuse.min.js" });

  eleventyConfig.addFilter("isSvg", value =>
    typeof value === "string" && value.toLowerCase().endsWith(".svg")
  );

  eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async (src, alt, className) => {
    const normalizedSrc = src.startsWith("/img/") ? src.replace("/img/", "img/") : src;
    const localPath = path.join("src", normalizedSrc);
    return generateImage(normalizedSrc, alt, className);
  });

  eleventyConfig.addCollection("products", () =>
    getProducts().map(product => ({
      ...product,
      url: `/products/${product.id}/`
    }))
  );

  eleventyConfig.addCollection("productCategories", () => {
    const products = getProducts();
    const categories = new Map();
    for (const product of products) {
      const entry = categories.get(product.category) ?? [];
      entry.push({
        ...product,
        url: `/products/${product.id}/`
      });
      categories.set(product.category, entry);
    }
    return Array.from(categories, ([name, items]) => ({
      name,
      slug: slugifyString(name),
      items
    }));
  });

  eleventyConfig.addCollection("productDietaryTags", () => {
    const tags = new Set();
    for (const product of getProducts()) {
      (product.dietary || []).forEach(tag => tags.add(tag));
    }
    return Array.from(tags)
      .sort((a, b) => a.localeCompare(b))
      .map(tag => ({ tag, slug: slugifyString(tag) }));
  });

  eleventyConfig.addCollection("productBenefitTags", () => {
    const tags = new Set();
    for (const product of getProducts()) {
      (product.benefits || []).forEach(tag => tags.add(tag));
    }
    return Array.from(tags)
      .sort((a, b) => a.localeCompare(b))
      .map(tag => ({ tag, slug: slugifyString(tag) }));
  });

  eleventyConfig.addFilter("readableDate", dateObj =>
    new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(dateObj)
  );

  eleventyConfig.addCollection("posts", collectionApi =>
    collectionApi
      .getFilteredByGlob("./src/blog/posts/**/*.{md,njk}")
      .sort((a, b) => b.date - a.date)
  );

  return {
    pathPrefix: "/creaciones-colibri",
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
