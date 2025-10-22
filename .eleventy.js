const fs = require("fs");
const path = require("path");
const generateImage = require("./.eleventy.images");

const ELEVENTY_OUTPUT_DIR = "_site-eleventy";

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

const getBundles = () => {
  delete require.cache[require.resolve("./src/_data/bundles.js")];
  return require("./src/_data/bundles.js");
};

const resolveFromRoot = relativePath => path.join(__dirname, relativePath);

const loadProductTranslations = () => {
  const candidates = [
    resolveFromRoot(".cache/i18n/products.es.json"),
    resolveFromRoot("src/_data/i18n/products.es.overrides.json")
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

const loadTranslations = () => {
  const files = [
    "./src/_data/i18n/en.json",
    "./src/_data/i18n/es.json",
    "./src/_data/i18n/catalog.en.json",
    "./src/_data/i18n/catalog.es.json"
  ];

  for (const file of files) {
    delete require.cache[require.resolve(file)];
  }

  return {
    en: require("./src/_data/i18n/en.json"),
    es: require("./src/_data/i18n/es.json"),
    catalog: {
      en: require("./src/_data/i18n/catalog.en.json"),
      es: require("./src/_data/i18n/catalog.es.json")
    },
    products: {
      es: loadProductTranslations()
    }
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
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

  eleventyConfig.addFilter("isSvg", value =>
    typeof value === "string" && value.toLowerCase().endsWith(".svg")
  );

  eleventyConfig.addNunjucksAsyncShortcode("responsiveImage", async (src, alt, className) => {
    const normalizedSrc = src.startsWith("/img/") ? src.replace("/img/", "img/") : src;
    const localPath = path.join("src", normalizedSrc);
    return generateImage(normalizedSrc, alt, className, ELEVENTY_OUTPUT_DIR);
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

  eleventyConfig.addCollection("bundles", () =>
    getBundles().map(bundle => ({
      ...bundle,
      url: `/bundles/${bundle.id}/`
    }))
  );

  eleventyConfig.addCollection("bundleSubscriptions", () =>
    getBundles().filter(bundle => bundle.type === "subscription")
  );

  eleventyConfig.addCollection("i18n", () => [
    {
      data: {
        i18n: loadTranslations()
      }
    }
  ]);

  eleventyConfig.addFilter("absoluteUrl", (url, base) => absoluteUrl(url, base));
  eleventyConfig.addFilter("date", (value, format) => formatDate(value, format));

  eleventyConfig.addFilter("readableDate", (dateObj, locale = "en") => {
    if (!dateObj) {
      return "";
    }

    const date = dateObj instanceof Date ? dateObj : new Date(dateObj);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const resolvedLocale = locale === "es" ? "es-CR" : "en-US";

    try {
      return new Intl.DateTimeFormat(resolvedLocale, { dateStyle: "long" }).format(date);
    } catch (error) {
      console.warn(`[i18n] Failed to format date for locale ${locale}: ${error.message}`);
      return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
    }
  });

  eleventyConfig.addCollection("posts", collectionApi =>
    collectionApi
      .getFilteredByGlob("./src/blog/posts/**/*.{md,njk}")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("posts_es", collectionApi =>
    collectionApi
      .getFilteredByGlob("./src/blog/posts/**/*.{md,njk}")
      .filter(post => post.data.locale === "es")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addFilter("json", value =>
    JSON.stringify(value, null, 2)
  );

  eleventyConfig.addFilter("merge", (target = {}, source = {}) => {
    if (Array.isArray(target) && Array.isArray(source)) {
      return target.concat(source);
    }
    return { ...target, ...source };
  });

  return {
    pathPrefix: "/creaciones-colibri",
    dir: {
      input: "src",
      output: ELEVENTY_OUTPUT_DIR
    }
  };
};
