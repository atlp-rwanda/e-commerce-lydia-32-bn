'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'isAdmin');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'isAdmin');
  },
};
