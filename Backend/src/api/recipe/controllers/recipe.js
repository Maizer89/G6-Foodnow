"use strict";

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

  async update(ctx) {
    if (!ctx.state.user) {
      return ctx.unauthorized("Du måste vara inloggad för att redigera ett recept.");
    }

    const documentId = ctx.params.id;
    const incomingData = ctx.request.body.data || {};

    const existing = await strapi.documents("api::recipe.recipe").findOne({
      documentId,
      populate: ["image"],
    });

    const cleanData = {};
    if (incomingData.title !== undefined) cleanData.title = incomingData.title;
    if (incomingData.description !== undefined) cleanData.description = incomingData.description;
    if (incomingData.instructions !== undefined) cleanData.instructions = incomingData.instructions;
    if (incomingData.cooking_time_minutes !== undefined) cleanData.cooking_time_minutes = incomingData.cooking_time_minutes;
    if (incomingData.ingredients !== undefined) cleanData.ingredients = incomingData.ingredients;

    if ("image" in incomingData) {
      cleanData.image = incomingData.image;
    } else if (existing?.image?.id) {
      cleanData.image = existing.image.id;
    } else {
      cleanData.image = null;
    }

    ctx.request.body.data = cleanData;
    const response = await super.update(ctx);
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
