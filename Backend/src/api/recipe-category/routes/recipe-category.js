"use strict";

/**
 * Flora custom router
 */

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/recipe-categories/:slug/recipes",
      handler: "recipe-category.recipes",
      config: {
        auth: false,
      },
    },
  ],
};
