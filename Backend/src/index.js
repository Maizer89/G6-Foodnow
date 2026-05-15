"use strict";

const seed = require("../scripts/seed");

const CONTENT_TYPES = {
  "api::ingredient": "ingredient",
  "api::ingredient-category": "ingredient-category",
  "api::recipe": "recipe",
  "api::recipe-category": "recipe-category",
};

const PUBLIC_ACTIONS = ["find", "findOne"];
const AUTH_ACTIONS = ["find", "findOne", "create", "update", "delete"];

function enableActionsForRole(role, actions) {
  for (const [apiKey, controllerName] of Object.entries(CONTENT_TYPES)) {
    const controller =
      role.permissions?.[apiKey]?.controllers?.[controllerName];

    if (!controller) continue;

    for (const action of actions) {
      if (controller[action]) {
        controller[action].enabled = true;
      }
    }
  }

  return role.permissions;
}

async function updateRolePermissions(strapi, roleType, actions) {
  const roleService = strapi.plugin("users-permissions").service("role");

  const roles = await roleService.find();
  const role = roles.find((item) => item.type === roleType);

  if (!role) {
    console.log(`Role saknas: ${roleType}`);
    return;
  }

  const fullRole = await roleService.findOne(role.id);

  const updatedPermissions = enableActionsForRole(fullRole, actions);

  await roleService.updateRole(role.id, {
    ...fullRole,
    permissions: updatedPermissions,
  });

  console.log(`Permissions uppdaterade för ${roleType}`);
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await seed(strapi);

    await updateRolePermissions(strapi, "public", PUBLIC_ACTIONS);
    await updateRolePermissions(strapi, "authenticated", AUTH_ACTIONS);
  },
};
