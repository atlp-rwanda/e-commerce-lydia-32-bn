'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notifications', 'updatedAt');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('notifications', 'updatedAt');
  },
};
