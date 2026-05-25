"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::ingredient-category.ingredient-category",
  ({ strapi }) => ({
    async withIngredients(ctx) {
      const ingredients = await strapi
        .documents("api::ingredient.ingredient")
        .findMany({
          populate: {
            ingredient_category: true,
          },
        });

      const groups = {};

      for (const ingredient of ingredients) {
        const category = ingredient.ingredient_category;

        const slug = category?.slug || "ovrigt";

        if (!groups[slug]) {
          groups[slug] = {
            id: category?.id || null,
            documentId: category?.documentId || null,
            name: category?.name || "Övrigt",
            slug,
            ingredients: [],
            ingredientCount: 0,
          };
        }

        groups[slug].ingredients.push({
          id: ingredient.id,
          documentId: ingredient.documentId,
          name_singular: ingredient.name_singular,
          name_plural: ingredient.name_plural,
        });

        groups[slug].ingredientCount += 1;
      }

      return {
        data: Object.values(groups),
      };
    },
  }),
);
