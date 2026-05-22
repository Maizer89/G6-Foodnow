'use strict';

module.exports = (plugin) => {
  const originalUpdate = plugin.controllers.user.update;

  plugin.controllers.user.update = async (ctx) => {
    const { id } = ctx.params;
    const { favorites } = ctx.request.body;

    if (favorites !== undefined) {
      const currentUser = ctx.state.user;

      if (!currentUser || currentUser.id.toString() !== id.toString()) {
        return ctx.unauthorized('You can only update your own profile');
      }

      try {
        await strapi.documents('plugin::users-permissions.user').update({
          documentId: currentUser.documentId,
          data: {
            favorites: favorites
          }
        });
      } catch (err) {
        console.error("Error updating favorites:", err);
        return ctx.internalServerError('Failed to update favorites relation: ' + err.message);
      }

      delete ctx.request.body.favorites;
    }

    if (Object.keys(ctx.request.body).length === 0) {
      const updatedUser = await strapi.documents('plugin::users-permissions.user').findOne({
        documentId: ctx.state.user.documentId,
        populate: ['role', 'favorites']
      });
      if (updatedUser) {
        delete updatedUser.password;
        delete updatedUser.resetPasswordToken;
        delete updatedUser.confirmationToken;
      }
      return ctx.send(updatedUser);
    }

    return await originalUpdate(ctx);
  };

  return plugin;
};
