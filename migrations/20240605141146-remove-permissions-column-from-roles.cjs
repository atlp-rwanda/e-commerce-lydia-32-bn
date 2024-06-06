'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Roles', 'permissions');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Roles', 'permissions');
  },
};
