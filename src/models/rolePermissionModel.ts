// models/rolePermissionModel.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import Role from './roleModel.js';
import Permission from './permissionModel.js';

class RolePermission extends Model {
  public roleId!: number;

  public permissionId!: number;
}

RolePermission.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: Role,
        key: 'id',
      },
      primaryKey: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      references: {
        model: Permission,
        key: 'id',
      },
      primaryKey: true,
      defaultValue: 4,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'RolePermission',
  },
);

export default RolePermission;
