'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'usertype');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'usertype');
  },
};
