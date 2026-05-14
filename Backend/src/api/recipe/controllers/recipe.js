"use strict";

/**
 * recept controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::recipe.recipe", ({ strapi }) => ({
  async create(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized(
        "Du måste vara inloggad för att skapa ett recept.",
      );
    }

    const { users_permissions_user: _ignored, ...cleanData } =
      ctx.request.body.data || {};
    ctx.request.body.data = cleanData;

    const response = await super.create(ctx);

    const entryId = response.data?.id;
    if (entryId) {
      await strapi.db.query("api::recipe.recipe").update({
        where: { id: entryId },
        data: { users_permissions_user: ctx.state.user.id },
      });
    }

    return response;
  },
}));
