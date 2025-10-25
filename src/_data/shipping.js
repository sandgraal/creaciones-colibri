module.exports = {
  domestic: {
    id: "domestic",
    heading: "United States & Puerto Rico",
    description:
      "Orders ship from Florida with compostable cushioning and USPS tracking for every box.",
    translations: {
      es: {
        heading: "Estados Unidos y Puerto Rico",
        description:
          "Enviamos desde Florida con relleno compostable y número de rastreo en cada caja."
      }
    },
    rows: [
      {
        condition: "Order total < $75.00",
        rate: "$8.00 flat rate",
        notes:
          "Covers USPS Priority Mail Cubic zones 4–6 plus eco-friendly packaging materials.",
        translations: {
          es: {
            condition: "Pedido menor a $75.00",
            rate: "Tarifa plana de $8.00",
            notes:
              "Cubre USPS Priority Mail Cubic zonas 4–6 y los materiales de empaque sostenibles."
          }
        }
      },
      {
        condition: "Order total ≥ $75.00",
        rate: "Free shipping",
        notes: "Perfect for bundles—shipping is on us once you cross the threshold.",
        translations: {
          es: {
            condition: "Pedido igual o mayor a $75.00",
            rate: "Envío gratis",
            notes:
              "Ideal para combos: nosotros cubrimos el envío al superar el umbral."
          }
        }
      }
    ]
  },
  international: {
    id: "international",
    heading: "International pilot destinations",
    description:
      "Canada, Costa Rica, and select EU countries ship with customs-ready documentation.",
    translations: {
      es: {
        heading: "Destinos internacionales piloto",
        description:
          "Canadá, Costa Rica y países piloto de la UE reciben documentación lista para aduanas."
      }
    },
    rows: [
      {
        condition: "Parcel weight ≤ 1.1 kg",
        rate: "$34.95",
        notes: "Matches USPS Priority Mail International small parcel pricing.",
        translations: {
          es: {
            condition: "Peso del paquete ≤ 1.1 kg",
            rate: "$34.95",
            notes: "Equivale a la tarifa de USPS Priority Mail International para paquetes pequeños."
          }
        }
      },
      {
        condition: "Parcel weight 1.1–2.5 kg",
        rate: "$44.95",
        notes: "Covers heavier bundles or multi-pack granola shipments.",
        translations: {
          es: {
            condition: "Peso del paquete 1.1–2.5 kg",
            rate: "$44.95",
            notes: "Cubre combos más pesados o envíos con varias granolas."
          }
        }
      },
      {
        condition: "Parcel weight > 2.5 kg",
        rate: "Live carrier quote",
        notes:
          "We’ll coordinate DHL Express or custom freight options and confirm rates before shipping.",
        translations: {
          es: {
            condition: "Peso del paquete > 2.5 kg",
            rate: "Cotización en vivo",
            notes:
              "Coordinamos DHL Express u opciones personalizadas y confirmamos la tarifa antes del envío."
          }
        }
      }
    ]
  },
  fulfillmentNotes: [
    {
      text:
        "Orders leave our Florida studio within two business days and include tracking once the label is printed.",
      translations: {
        es: {
          text:
            "Los pedidos salen de nuestro estudio en Florida en un máximo de dos días hábiles e incluyen rastreo cuando imprimimos la etiqueta."
        }
      }
    },
    {
      text:
        "Costa Rica deliveries ship with bilingual ingredient lists and customs documentation prepared in advance.",
      translations: {
        es: {
          text:
            "Los envíos hacia Costa Rica incluyen listas de ingredientes bilingües y documentación aduanal preparada con antelación."
        }
      }
    },
    {
      text:
        "Need wholesale or bulk rates? Email hola@creacionescolibri.com for a tailored quote.",
      html:
        "Need wholesale or bulk rates? Email <a href=\"mailto:hola@creacionescolibri.com\">hola@creacionescolibri.com</a> for a tailored quote.",
      translations: {
        es: {
          text:
            "¿Necesitas tarifas mayoristas o por volumen? Escríbenos a hola@creacionescolibri.com para una cotización personalizada.",
          html:
            "¿Necesitas tarifas mayoristas o por volumen? Escríbenos a <a href=\"mailto:hola@creacionescolibri.com\">hola@creacionescolibri.com</a> para una cotización personalizada."
        }
      }
    }
  ]
};
