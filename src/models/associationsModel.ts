// models/associations.ts
import Role from './roleModel.js';
import Permission from './permissionModel.js';
import RolePermission from './rolePermissionModel.js';

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });
