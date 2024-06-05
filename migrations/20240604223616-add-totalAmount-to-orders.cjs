'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'totalAmount', {
     
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    });
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'totalAmount');
  },
};