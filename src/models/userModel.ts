import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import Role from './roleModel.js';

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
  roleId: number;
  isverified: boolean;
  isAdmin: boolean;
  isBlocked: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

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
  public roleId!: number;
  public isverified!: boolean;
  public isAdmin!: boolean;
  public isBlocked!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

public static async getRoleName(userId: number): Promise<string> {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  const role = await Role.findByPk(user.roleId);
  if (!role) {
    throw new Error('Role not found');
  }
  
  return role.name;
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
    usertype: {
      type: DataTypes.ENUM('buyer', 'seller'),
      defaultValue: 'buyer',
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
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
