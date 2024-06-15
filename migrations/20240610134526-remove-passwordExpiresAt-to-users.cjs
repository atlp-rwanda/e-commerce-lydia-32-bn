'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'passwordExpiresAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'passwordExpiresAt');
  },
};
