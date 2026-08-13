module.exports = function (eleventyConfig) {
  // Static assets: copy these to _site unchanged on every build.
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("_redirects");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon-v2.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon-v2.png");
  eleventyConfig.addPassthroughCopy("og-image-2.png");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("llms.txt");

  // Keep internal docs out of the published site.
  eleventyConfig.ignores.add("BRAND.md");
  eleventyConfig.ignores.add("README.md");
};
