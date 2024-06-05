'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'payment');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'payment');
  },
};
