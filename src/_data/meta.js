const siteMeta = require("./siteMeta");

module.exports = {
  default: {
    title: siteMeta.title,
    description: siteMeta.description,
    image: siteMeta.socialImage
  },
  pages: {
    contact: {
      title: "Contact",
      description: "Reach out to Creaciones Colibrí for collaborations, wholesale inquiries, or questions about our products.",
      image: siteMeta.socialImage
    },
    contact_es: {
      title: "Contacto",
      description: "Escríbenos para colaboraciones, distribución o preguntas sobre nuestros productos artesanales.",
      image: siteMeta.socialImage
    },
    blog: {
      title: "Blog",
      description: "Stories and fermentation notes from the Creaciones Colibrí kitchen.",
      image: siteMeta.socialImage
    },
    blog_es: {
      title: "Blog",
      description: "Historias, recetas y inspiración de la cocina Creaciones Colibrí.",
      image: siteMeta.socialImage
    }
  }
};
