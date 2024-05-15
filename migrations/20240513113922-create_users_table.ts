import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      Firstname: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      Othername: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      Email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      Password: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      UserType: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      postal_code: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('users');
  },
};