const Image = require("@11ty/eleventy-img");
const path = require("path");

const widths = [320, 480, 640];
const formats = ["webp", "jpeg"];

module.exports = async function generateImage(src, alt, className = "responsive-image") {
  if (!alt) {
    throw new Error(`Missing alt text for image: ${src}`);
  }

  const extension = path.extname(src).toLowerCase();
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;

  if (extension === ".svg") {
    return `<img class="${className}" src="${normalizedSrc}" alt="${alt.replace(/"/g, "&quot;")}" loading="lazy" decoding="async">`;
  }

  const inputPath = path.join("src", normalizedSrc.replace(/^\//, ""));
  const metadata = await Image(inputPath, {
    widths,
    formats,
    urlPath: "/img/generated/",
    outputDir: "_site/img/generated/",
    sharpWebpOptions: { quality: 70 },
    sharpJpegOptions: { quality: 75 }
  });

  const imageAttributes = {
    class: className,
    alt,
    loading: "lazy",
    decoding: "async"
  };

  return Image.generateHTML(metadata, imageAttributes);
};
