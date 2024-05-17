'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
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
      },
      phone: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      password: {
        type: new Sequelize.STRING(128),
        allowNull: false,
      },
      usertype: {
        type: new Sequelize.STRING(128),
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
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};