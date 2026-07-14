module.exports = function (eleventyConfig) {
  // Static assets: copy these to _site unchanged on every build.
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("analytics.js");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("og-image.png");
  eleventyConfig.addPassthroughCopy("rachel-beck.webp");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("llms.txt");

  // Keep internal docs out of the published site.
  eleventyConfig.ignores.add("BRAND.md");
  eleventyConfig.ignores.add("README.md");
};
