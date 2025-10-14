module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });

  return {
    pathPrefix: "/creaciones-colibri",
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
