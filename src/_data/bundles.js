const products = require("./products");

const productLookup = new Map(products.map(product => [product.id, product]));

const enhanceContents = contents =>
  contents.map(item => {
    const product = productLookup.get(item.productId);
    const fallbackName = item.name || (product && product.name);
    const fallbackUnit = item.unit || (product && product.unit);
    return {
      ...item,
      product,
      productId: item.productId,
      name: fallbackName,
      unit: fallbackUnit
    };
  });

const bundles = [
  {
    id: "tropical-heat-duo",
    type: "bundle",
    name: "Tropical Heat Duo",
    shortDescription: "Pair our flagship chocolate habanero sauce with the mango-guava bestseller for an instant flavor tour.",
    description:
      "A gift-ready duo that balances the smoky depth of Salsa Picante Chocolate Habanero with the bright sweetness of Mango Guava Fire. It ships with recyclable cushioning and a tasting card so recipients know how to enjoy every drop.",
    price: 26,
    unit: "2 x 5 oz bottles",
    image: {
      src: "/img/bundles/tropical_heat_duo.svg",
      alt: "Two abstract hot sauce bottles with tropical gradients representing the Tropical Heat Duo bundle."
    },
    contents: [
      { productId: "salsa-picante-chocolate-habanero", quantity: 1 },
      { productId: "mango-guava-fire", quantity: 1 }
    ],
    perks: [
      "Includes tasting notes and pairing tips",
      "Ships in compostable protective packaging",
      "Perfect host gift for spice lovers"
    ],
    translations: {
      es: {
        name: "Dúo de calor tropical",
        shortDescription: "Combina nuestra salsa insignia de chocolate habanero con el éxito de mango y guayaba para un tour de sabor instantáneo.",
        description:
          "Un dúo listo para regalar que equilibra la profundidad ahumada de la Salsa Picante Chocolate Habanero con la dulzura brillante de Mango Guava Fire. Llega con protección reciclable y una tarjeta con sugerencias para disfrutar cada gota.",
        unit: "2 botellas de 5 oz",
        perks: [
          "Incluye notas de cata y sugerencias de maridaje",
          "Empaque protector compostable",
          "Regalo ideal para amantes del picante"
        ]
      }
    }
  },
  {
    id: "wellness-reset-kit",
    type: "bundle",
    name: "Wellness Reset Kit",
    shortDescription: "A restorative trio featuring sipping broth, adaptogenic cashew butter, and a hibiscus-ginger spritzer kit.",
    description:
      "Designed for cozy afternoons or post-adventure recovery, the Wellness Reset Kit layers hydration, plant-powered protein, and functional botanicals. Each set arrives with a printed ritual card to guide steeping, sipping, and mindful snacking moments.",
    price: 52,
    unit: "3-piece set",
    image: {
      src: "/img/bundles/wellness_reset_kit.svg",
      alt: "Three abstract jars and sachets with calming greens and magentas representing the Wellness Reset Kit."
    },
    contents: [
      { productId: "verde-vibrante-sipping-broth", quantity: 1 },
      { productId: "selva-noche-cashew-butter", quantity: 1 },
      { productId: "hibiscus-ginger-spritzer-kit", quantity: 1 }
    ],
    perks: [
      "Lion's mane adaptogens and moringa hydration",
      "Includes ritual card with preparation tips",
      "Great for wellness gifting or retreat welcome baskets"
    ],
    translations: {
      es: {
        name: "Kit de reinicio wellness",
        shortDescription: "Un trío restaurador con caldo para sorber, mantequilla de marañón adaptógena y kit de hibisco con jengibre.",
        description:
          "Pensado para tardes reconfortantes o recuperación después de la aventura, el Kit de reinicio wellness combina hidratación, proteína vegetal y botánicos funcionales. Cada set llega con una tarjeta impresa que guía la preparación y los momentos de pausa consciente.",
        unit: "Set de 3 piezas",
        perks: [
          "Adaptógenos de melena de león y moringa hidratante",
          "Incluye tarjeta ritual con consejos de preparación",
          "Perfecto para regalar bienestar o canastas de bienvenida"
        ]
      }
    }
  },
  {
    id: "granola-monthly-subscription",
    type: "subscription",
    name: "Granola of the Month Subscription",
    shortDescription: "Receive Sunrise Citrus Granola plus rotating limited releases delivered to your doorstep every month.",
    description:
      "Each month we bake a seasonal granola inspired by Costa Rican markets—think cacao nib crunch in winter or passionfruit macadamia in summer. Subscribers get first access to new blends, recipe cards, and occasional surprise add-ins.",
    price: 22,
    unit: "$22 per delivery",
    billing: {
      interval: "month",
      intervalCount: 1
    },
    image: {
      src: "/img/bundles/granola_subscription.svg",
      alt: "Illustrated granola jar with calendar accents symbolizing the monthly granola subscription."
    },
    contents: [
      {
        productId: "sunrise-citrus-granola",
        quantity: 1,
        notes:
          "Base shipment includes Sunrise Citrus Granola; seasonal flavors rotate monthly and are announced via email."
      }
    ],
    perks: [
      "Early access to limited-run granola flavors",
      "Recipe cards with pairing ideas in every box",
      "Pause or skip deliveries anytime before the billing date"
    ],
    translations: {
      es: {
        name: "Suscripción Granola del Mes",
        shortDescription: "Recibe Sunrise Citrus Granola y ediciones limitadas directamente en tu puerta cada mes.",
        description:
          "Cada mes horneamos una granola estacional inspirada en las ferias costarricenses—desde crujiente de cacao en invierno hasta maracuyá con macadamia en verano. Las personas suscritas reciben acceso anticipado, tarjetas de recetas y sorpresas ocasionales.",
        unit: "$22 por entrega",
        perks: [
          "Acceso prioritario a sabores de edición limitada",
          "Tarjetas de recetas y maridajes en cada envío",
          "Puedes pausar o saltar entregas antes de la fecha de cobro"
        ]
      }
    }
  }
].map(bundle => ({
  ...bundle,
  contents: enhanceContents(bundle.contents)
}));

module.exports = bundles;
