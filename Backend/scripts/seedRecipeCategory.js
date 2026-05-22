"use strict";

const fs = require("fs");
const path = require("path");

const categories = [
  {
    name: "Bak & dessert",
    slug: "bak-dessert",
    image: "bak-dessert.jpg",
  },
  {
    name: "Dryck",
    slug: "dryck",
    image: "dryck.jpg",
  },
  {
    name: "Kött",
    slug: "koett",
    image: "kott.jpg",
  },
  {
    name: "Kyckling",
    slug: "kyckling",
    image: "kyckling.jpg",
  },
  {
    name: "Fisk",
    slug: "fisk",
    image: "fisk.jpg",
  },
  {
    name: "Skaldjur",
    slug: "skaldjur",
    image: "skaldjur.jpg",
  },
  {
    name: "Vegetariskt",
    slug: "vegetariskt",
    image: "vegetariskt.jpg",
  },
  {
    name: "Veganskt",
    slug: "veganskt",
    image: "veganskt.jpg",
  },
];

async function uploadImage(strapi, fileName) {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "recipeCategoryImages",
    fileName,
  );

  const fileStat = fs.statSync(filePath);

  const uploadedFiles = await strapi.plugins.upload.services.upload.upload({
    data: {},
    files: {
      path: filePath,
      name: fileName,
      type: "image/jpeg",
      size: fileStat.size,
    },
  });

  return uploadedFiles[0];
}

module.exports = async function seedRecipeCategories(strapi) {
  for (const category of categories) {
    const existing = await strapi
      .documents("api::recipe-category.recipe-category")
      .findFirst({
        filters: {
          slug: category.slug,
        },
      });

    if (existing) {
      console.log(`Kategori finns redan: ${category.name}`);
      continue;
    }

    const uploadedImage = await uploadImage(strapi, category.image);

    await strapi.documents("api::recipe-category.recipe-category").create({
      data: {
        name: category.name,
        slug: category.slug,
        image: uploadedImage.id,
      },
    });

    console.log(`Kategori skapad: ${category.name}`);
  }
};
