#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const cacheDir = path.join(rootDir, ".cache", "i18n");
const cacheFile = path.join(cacheDir, "products.es.json");
const manifestFile = path.join(cacheDir, "products.manifest.json");
const overridesFile = path.join(rootDir, "src", "_data", "i18n", "products.es.overrides.json");

const { translateText } = require("./translation/translator");

const loadJson = (filePath, fallback) => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[translate] Failed to read ${filePath}: ${error.message}`);
    return fallback;
  }
};

const saveJson = (filePath, data) => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const getHash = text =>
  crypto
    .createHash("sha256")
    .update(text)
    .digest("hex");

const manifest = loadJson(manifestFile, {});

const translateWithCache = async text => {
  if (typeof text !== "string" || !text.trim()) {
    return text;
  }
  const key = getHash(text);
  const cached = manifest[key];
  if (cached && cached.source === text && typeof cached.target === "string") {
    return cached.target;
  }
  const translated = await translateText(text, "es");
  manifest[key] = {
    source: text,
    target: translated,
    updatedAt: new Date().toISOString()
  };
  return translated;
};

const translateArray = async array => {
  if (!Array.isArray(array)) {
    return array;
  }
  const results = [];
  for (const item of array) {
    if (typeof item === "string") {
      results.push(await translateWithCache(item));
    } else {
      results.push(item);
    }
  }
  return results;
};

async function buildTranslations() {
  const products = require(path.join(rootDir, "src", "_data", "products.js"));
  const overrides = loadJson(overridesFile, {});

  const translated = {};
  for (const product of products) {
    const override = overrides[product.id] || {};
    translated[product.id] = {
      name: override.name || (await translateWithCache(product.name)),
      shortDescription:
        override.shortDescription || (await translateWithCache(product.shortDescription)),
      description: override.description || (await translateWithCache(product.description)),
      unit: override.unit || (await translateWithCache(product.unit)),
      ingredients: override.ingredients || (await translateArray(product.ingredients)),
      dietary: override.dietary || (await translateArray(product.dietary)),
      benefits: override.benefits || (await translateArray(product.benefits))
    };
  }

  saveJson(cacheFile, translated);
  saveJson(manifestFile, manifest);
  console.log(`[translate] Wrote ${Object.keys(translated).length} product translations to ${path.relative(rootDir, cacheFile)}`);
}

buildTranslations().catch(error => {
  console.error(error);
  process.exit(1);
});
