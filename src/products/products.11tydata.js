export default {
  layout: "product.njk",
  eleventyComputed: {
    title: (data) => data.name,
    description: (data) => data.short,
    ogImage: (data) => data.image,
    permalink: (data) => `/produs/${data.page.fileSlug}/`,
    product: (data) => ({
      name: data.name,
      short: data.short,
      price: data.price,
      oldPrice: data.oldPrice,
      sku: data.sku,
      category: data.category,
      stock: data.stock,
      image: data.image,
      gallery: data.gallery,
      brand: data.brand,
      specs: data.specs,
    }),
  },
};
