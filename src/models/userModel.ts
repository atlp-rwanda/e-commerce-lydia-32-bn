import {
  DataTypes, Model, Optional, BuildOptions
} from 'sequelize';
import sequelize from '../config/db.js';
import { toDefaultValue } from 'sequelize/types/utils.js';

interface UserAttributes {
  id: number;
  firstname: string;
  othername: string;
  email: string;
  phone: string;
  password: string;
  usertype: 'buyer' | 'seller';
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  isverified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'firstname'> {
  firstname: string;
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;

  public firstname!: string;

  public othername!: string;

  public email!: string;

  public phone!: string;

  public password!: string;

  public usertype!: 'buyer' | 'seller';

  public street!: string;

  public city!: string;

  public state!: string;

  public postal_code!: string;

  public country!: string;

  public isverified!: boolean;

  public isAdmin!: boolean;

  public isBlocked!: boolean

  // Timestamps
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(128),
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    usertype: {
      type: DataTypes.ENUM('buyer', 'seller'),
      defaultValue: 'buyer'
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
    isverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance
  }
);

export default User;
