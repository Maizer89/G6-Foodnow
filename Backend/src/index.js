'use strict';

const seed = require('../scripts/seed');

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await seed(strapi);
  },
};