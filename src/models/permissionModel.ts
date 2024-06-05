// models/permissionModel.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface PermissionAttributes {
  id: number;
  name: string;
}

interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> {}

class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
  public id!: number;

  public name!: string;
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Permission',
  },
);

export default Permission;
