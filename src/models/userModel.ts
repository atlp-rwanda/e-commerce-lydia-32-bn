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
  street: string |  null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  isverified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
  hasTwoFactor:boolean;
  twoFactorSecret: string | null
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

  public street!: string | null;

  public city!: string | null;

  public state!: string | null;

  public postal_code!: string | null;

  public country!: string | null;

  public isverified!: boolean;

  public isAdmin!: boolean;

  public isBlocked!: boolean;

  public hasTwoFactor!:boolean;

  public twoFactorSecret!: string | null;

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
    isverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
   
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hasTwoFactor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance
  },
);

export default User;