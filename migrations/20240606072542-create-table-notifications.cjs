'use strict';

const { type } = require('os');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      message: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      readstatus: {
        type: new Sequelize.BOOLEAN(),
        allowNull: false,
        default: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notiffications');
  },
};
