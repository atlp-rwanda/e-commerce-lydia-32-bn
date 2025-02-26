'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {}
  }

  User.init(
    {
      firstname: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      othername: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(128),
      },
      phone: {
        type: new DataTypes.STRING(128),
      },
      password: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      usertype: {
        type: DataTypes.ENUM('buyer', 'seller'),
        defaultValue: 'buyer',
      },
      street: {
        type: new DataTypes.STRING(128),
      },
      city: {
        type: new DataTypes.STRING(128),
      },
      state: {
        type: new DataTypes.STRING(128),
      },
      postal_code: {
        type: new DataTypes.STRING(128),
      },
      country: {
        type: new DataTypes.STRING(128),
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
