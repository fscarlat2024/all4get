export default function (eleventyConfig) {
  // Copiaza assets si fisierele statice ca atare
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Colectia de produse (fisiere din src/products/*.md)
  eleventyConfig.addCollection("products", (api) =>
    api
      .getFilteredByGlob("src/products/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  // Categorii unice extrase din produse
  eleventyConfig.addCollection("categories", (api) => {
    const set = new Set();
    api.getFilteredByGlob("src/products/*.md").forEach((p) => {
      if (p.data.category) set.add(p.data.category);
    });
    return [...set].sort();
  });

  // Filtru: pret RON formatat "1.234,56 lei"
  eleventyConfig.addFilter("lei", (value) => {
    const n = Number(value || 0);
    return (
      n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
      " lei"
    );
  });

  // Filtru: slug simplu pentru linkuri de categorie
  eleventyConfig.addFilter("slug", (str) =>
    String(str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
