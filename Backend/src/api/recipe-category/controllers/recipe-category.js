"use strict";

/**
 * Flora custom controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::recipe-category.recipe-category",
  ({ strapi }) => ({

    // Custom endpoint:
    // Hämtar alla recept som tillhör en viss receptkategori.
    async recipes(ctx) {
      const { slug } = ctx.params;

      // Kontrollera att en slug skickades med
      if (!slug) {
        return ctx.badRequest(
          "Du måste ange en kategori."
        );
      }

      // Hitta kategorin via slug
      const category = await strapi
        .documents("api::recipe-category.recipe-category")
        .findFirst({
          filters: {
            slug: {
              $eq: slug,
            },
          },
        });

      // Om kategorin inte finns
      if (!category) {
        return ctx.notFound(
          "Kategorin kunde inte hittas."
        );
      }

      // Hämta recepten som tillhör kategorin
      const recipes = await strapi
        .documents("api::recipe.recipe")
        .findMany({
          filters: {
            recipe_category: {
              documentId: {
                $eq: category.documentId,
              },
            },
          },
          populate: {
            image: true,
            ingredients: {
              populate: ["ingredient"],
            },
            recipe_category: true,
          },
        });

      return {
        data: recipes,
      };
    },

  })
);