const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("analytics.js");
  eleventyConfig.addPassthroughCopy("script.js");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("favicon.png");
  eleventyConfig.addPassthroughCopy("apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("og-image.png");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("llms.txt");

  eleventyConfig.ignores.add("BRAND.md");
  eleventyConfig.ignores.add("README.md");

  eleventyConfig.on("eleventy.after", async ({ directories, results }) => {
    const templatePath = path.join(__dirname, "_headers.template");
    const template = fs.readFileSync(templatePath, "utf8");

    const inlineScriptRe = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
    const hashes = new Set();

    for (const page of results || []) {
      if (!page.content) continue;
      inlineScriptRe.lastIndex = 0;
      let match;
      while ((match = inlineScriptRe.exec(page.content))) {
        const code = match[1];
        if (!code || !code.trim()) continue;
        const hash = crypto.createHash("sha256").update(code, "utf8").digest("base64");
        hashes.add(`'sha256-${hash}'`);
      }
    }

    const hashList = Array.from(hashes).sort().join(" ");
    const finalHeaders = template.replace("__INLINE_SCRIPT_HASHES__", hashList);
    fs.writeFileSync(path.join(directories
