const slugify = value =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const translateCategory = category => {
  switch (category) {
    case "Hot Sauces":
      return "Salsas picantes";
    case "Granola & Crunch":
      return "Granolas y crujientes";
    case "Wellness Pantry":
      return "Despensa de bienestar";
    default:
      return category;
  }
};

const ensureArray = value => {
  if (Array.isArray(value)) {
    return value;
  }
  if (value === undefined || value === null) {
    return [];
  }
  return [value];
};

const clone = value => {
  if (value && typeof value === "object") {
    return JSON.parse(JSON.stringify(value));
  }
  return value;
};

const buildLocalizedProduct = data => {
  const baseProduct = data.baseProduct || {};
  const translations =
    data.collections &&
    Array.isArray(data.collections.i18n) &&
    data.collections.i18n[0] &&
    data.collections.i18n[0].data
      ? data.collections.i18n[0].data.i18n
      : null;
  const productTranslations =
    translations && translations.products && translations.products.es
      ? translations.products.es
      : {};
  const translation = productTranslations[baseProduct.id] || {};

  const pick = (primary, fallback) =>
    primary !== undefined && primary !== null && primary !== ""
      ? primary
      : fallback;

  const pickArray = (primary, fallback) => {
    const normalizedPrimary = ensureArray(primary);
    if (normalizedPrimary.length) {
      return normalizedPrimary;
    }
    return ensureArray(fallback);
  };

  return {
    id: baseProduct.id,
    name: pick(translation.name, baseProduct.name),
    shortDescription: pick(
      translation.shortDescription,
      baseProduct.shortDescription
    ),
    description: pick(translation.description, baseProduct.description),
    price: baseProduct.price,
    unit: pick(translation.unit, baseProduct.unit),
    category: translateCategory(baseProduct.category),
    dietary: pickArray(translation.dietary, baseProduct.dietary),
    benefits: pickArray(translation.benefits, baseProduct.benefits),
    labels: pickArray(translation.labels, baseProduct.labels),
    includedHeading: pick(
      translation.includedHeading,
      baseProduct.includedHeading
    ),
    includedProducts: clone(
      translation.includedProducts || baseProduct.includedProducts || []
    ),
    bundleExtrasHeading: pick(
      translation.bundleExtrasHeading,
      baseProduct.bundleExtrasHeading
    ),
    bundleExtras: clone(
      translation.bundleExtras || baseProduct.bundleExtras || []
    ),
    subscription: clone(
      translation.subscription || baseProduct.subscription || null
    ),
    shippingNote: pick(translation.shippingNote, baseProduct.shippingNote),
    image: clone(baseProduct.image),
    heatLevel:
      baseProduct.heatLevel !== undefined ? baseProduct.heatLevel : null,
    ingredients: clone(
      translation.ingredients || baseProduct.ingredients || []
    )
  };
};

module.exports = {
  eleventyComputed: {
    tags: data => {
      const baseProduct = data.baseProduct || {};
      const categorySlug = slugify(baseProduct.category || "");
      return categorySlug ? ["product", categorySlug] : ["product"];
    },
    product: data => buildLocalizedProduct(data),
    title: data => {
      const localized = buildLocalizedProduct(data);
      return localized.name || (data.baseProduct && data.baseProduct.name);
    },
    description: data => {
      const localized = buildLocalizedProduct(data);
      return (
        localized.shortDescription ||
        localized.description ||
        (data.baseProduct &&
          (data.baseProduct.shortDescription || data.baseProduct.description))
      );
    },
    localeLinks: data => {
      const baseProduct = data.baseProduct || {};
      if (!baseProduct.id) {
        return {};
      }
      return {
        en: `/products/${baseProduct.id}/`
      };
    }
  }
};
