'use strict';

const { type } = require("os");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstname: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      othername: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      email: {
        type: new Sequelize.STRING(128),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: new Sequelize.STRING(128),
      },
      password: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      usertype: {
        type: Sequelize.ENUM('buyer', 'seller'),
        defaultValue: 'buyer',
        allowNull: false,
      },
      street: {
        type: new Sequelize.STRING(128),
      },
      city: {
        type: new Sequelize.STRING(128),
      },
      state: {
        type: new Sequelize.STRING(128),
      },
      postal_code: {
        type: new Sequelize.STRING(128),
      },
      country: {
        type: new Sequelize.STRING(128),
      },
      isverified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isBlocked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};