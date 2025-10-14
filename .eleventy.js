const path = require("path");
const generateImage = require("./.eleventy.images");

const absoluteUrl = (path, base) => {
  try {
    return new URL(path, base).href;
  } catch {
    return path;
  }
};

const formatDate = (value, format = "yyyy-MM-dd") => {
  if (!value) {
    return "";
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  if (format === "iso" || format === "ISO") {
    return date.toISOString();
  }
  if (format === "yyyy-MM-dd") {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const styles = new Set(["full", "long", "medium", "short"]);
  if (styles.has(format)) {
    return new Intl.DateTimeFormat("en-US", { dateStyle: format }).format(date);
  }
  return date.toISOString();
};

const getProducts = () => {
  delete require.cache[require.resolve("./src/_data/products.js")];
  return require("./src/_data/products.js");
};

const loadTranslations = () => {
  delete require.cache[require.resolve("./src/_data/i18n/en.json")];
  delete require.cache[require.resolve("./src/_data/i18n/es.json")];
  return {
    en: require("./src/_data/i18n/en.json"),
    es: require("./src/_data/i18n/es.json")
  };
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

  eleventyConfig.addNunjucksAsyncShortcode("analytics", async () => {
    return process.env.PLAUSIBLE_DOMAIN
      ? `<script defer data-domain="${process.env.PLAUSIBLE_DOMAIN}" src="https://plausible.io/js/script.js"></script>`
      : "";
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

  eleventyConfig.addCollection("i18n", () => [
    {
      data: {
        i18n: loadTranslations()
      }
    }
  ]);

  eleventyConfig.addFilter("absoluteUrl", (url, base) => absoluteUrl(url, base));
  eleventyConfig.addFilter("date", (value, format) => formatDate(value, format));

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
