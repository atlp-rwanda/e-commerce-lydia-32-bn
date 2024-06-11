import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import Role from './roleModel.js';

export interface UserAttributes {
  id: number;
  firstname: string;
  othername: string;
  email: string;
  phone: string;
  password: string;
  lastPasswordChange: Date;
  passwordExpiresAt: Date;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  roleId: number;
  isverified: boolean;
  isBlocked: boolean;
  hasTwoFactor: boolean;
  twoFactorSecret: string | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;

  public firstname!: string;

  public othername!: string;

  public email!: string;

  public phone!: string;

  public password!: string;

  public lastPasswordChange!: Date;

  public passwordExpiresAt!: Date;

  public street!: string | null;

  public city!: string | null;

  public state!: string | null;

  public postal_code!: string | null;

  public country!: string | null;

  public roleId!: number;

  public isverified!: boolean;

  public isBlocked!: boolean;

  public hasTwoFactor!: boolean;

  public twoFactorSecret!: string | null;

  // Timestamps
  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public static async getRoleName(userId: number): Promise<string> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await Role.findByPk(user.dataValues.roleId);
    console.log(role);
    if (!role) {
      throw new Error('Role not found');
    }

    return role.dataValues.name;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    othername: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    lastPasswordChange: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    }, 
    passwordExpiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
      defaultValue: 1,
    },
    isverified: {
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
    },
  },
  {
    tableName: 'users',
    sequelize,
    hooks: {
      beforeCreate: (user) => {
        if (!user.roleId) {
          user.roleId = 1;
        }
      },
    },
  },
);

User.belongsTo(Role, { foreignKey: 'roleId' });

export default User;
