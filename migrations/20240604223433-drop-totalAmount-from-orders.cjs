'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'totalAmount');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'totalAmount');
  },
};
