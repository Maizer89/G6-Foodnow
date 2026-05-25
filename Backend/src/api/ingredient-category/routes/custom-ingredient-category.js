"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/ingredient-categories/with-ingredients",
      handler: "ingredient-category.withIngredients",
      config: {
        auth: false,
      },
    },
  ],
};
