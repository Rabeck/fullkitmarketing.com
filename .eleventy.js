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
    eleventyConfig.addPassthroughCopy("audit");

  // Keep internal docs out of the published site.
  eleventyConfig.ignores.add("BRAND.md");
  eleventyConfig.ignores.add("README.md");

  // Minify CSS and JS in the build output only. Edit the readable
  // styles.css / script.js in the repo as usual; Cloudflare serves the
  // minified copies. After a CSS or JS change, bump ?v= in every page.
  eleventyConfig.on("eleventy.after", async ({ dir }) => {
    const esbuild = require("esbuild");
    const path = require("path");
    const files = ["styles.css", "script.js"];
    for (const f of files) {
      const out = path.join(dir.output, f);
      await esbuild.build({
        entryPoints: [out],
        outfile: out,
        allowOverwrite: true,
        minify: true,
        bundle: false,
        target: ["es2017", "chrome90", "firefox90", "safari14"],
        logLevel: "warning",
      });
    }
  });
};
