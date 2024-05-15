import { DataTypes, Model, Optional, BuildOptions, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';

interface UserAttributes {
  id: number;
  firstname: string;
  othername: string;
  email: string;
  phone: string;
  password: string;
  usertype: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  isAdmin: boolean;
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

  public usertype!: string;

  public street!: string;

  public city!: string;

  public state!: string;

  public postal_code!: string;

  public country!: string;

  public isAdmin!: boolean;

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
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    usertype: {
      type: new DataTypes.STRING(128),
      allowNull: false,
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
    tableName: 'users',
    sequelize, // passing the `sequelize` instance
  },
);

export default User;
