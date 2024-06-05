// services/roleService.ts
import User from '../../models/userModel.js';
import Role from '../../models/roleModel.js';
import Permission from '../../models/permissionModel.js';
import RolePermission from '../../models/rolePermissionModel.js';
import { rolePermissions, PermissionKey } from '../../utilis/roles/roles.util.js';
import sequelize from '../../config/db.js';

class roleService {
  async assignRole(userId: number, roleId: number) {
    const user = await User.findByPk(userId);
    const role = await Role.findByPk(roleId);

    if (!user) {
      throw new Error('User not found');
    }
    if (!role) {
      throw new Error('Role not found');
    }

    user.roleId = role.id;
    await user.save();
    return user;
  }

  async createRole(name: string) {
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      throw new Error('Role already exists');
    }

    try {
      // Start a transaction to ensure consistency
      const transaction = await sequelize.transaction();

      try {
        // Create the new role within the transaction
        const role = await Role.create({ name }, { transaction });

        // Ensure default permission exists
        const defaultPermissionName = 'read';
        let defaultPermission = await Permission.findOne({ where: { name: defaultPermissionName } });

        if (!defaultPermission) {
          defaultPermission = await Permission.create({ name: defaultPermissionName }, { transaction });
        }
        await RolePermission.create(
          { roleId: role.dataValues.id, permissionId: defaultPermission.dataValues.id },
          { transaction },
        );

        // Commit the transaction
        await transaction.commit();

        return role;
      } catch (error) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        throw error;
      }
    } catch (error: any) {
      console.error('Error creating role:', error);
      throw new Error(`Error creating role: ${error.message}`);
    }
  }

  async getAllRoles() {
    try {
      const roles = await Role.findAll();
      return roles.map((role) => role.toJSON());
    } catch (error: any) {
      throw new Error(`Error fetching roles: ${error.message}`);
    }
  }

  async getRoleById(roleId: number) {
    try {
      const role = await Role.findByPk(roleId);
      return role ? role.toJSON() : null;
    } catch (error: any) {
      throw new Error(`Error fetching role: ${error.message}`);
    }
  }

  async updateRole(roleId: number, updates: Partial<Role>): Promise<Role | null> {
    try {
      const role = await Role.findByPk(roleId);
      if (role) {
        await role.update(updates);
        return role;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Error updating role: ${error.message}`);
    }
  }

  async getRolePermissions(role: string): Promise<PermissionKey[]> {
    if (!rolePermissions[role]) {
      throw new Error('Role does not exist');
    }
    return rolePermissions[role];
  }

  async addPermissionToRole(roleId: number, permissionId: number) {
    const role = await Role.findByPk(roleId);
    const permission = await Permission.findByPk(permissionId);

    if (!role) {
      throw new Error('Role not found');
    }

    if (!permission) {
      throw new Error('Permission not found');
    }

    await RolePermission.create({ roleId, permissionId });
  }

  async removePermissionFromRole(roleId: number, permissionId: number) {
    const role = await Role.findByPk(roleId);
    if (!role) {
      throw new Error('Role does not exist');
    }

    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      throw new Error('Permission does not exist');
    }

    const rolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (!rolePermission) {
      throw new Error('Permission does not exist for this role');
    }

    await rolePermission.destroy();
  }

  async createPermission(name: string) {
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      throw new Error('Permission already exists');
    }

    const permission = await Permission.create({ name });
    return permission;
  }

  async getAllPermissions() {
    try {
      const roles = await Permission.findAll();
      return roles.map((permission) => permission.toJSON());
    } catch (error: any) {
      throw new Error(`Error fetching permissions: ${error.message}`);
    }
  }

  async deleteRole(roleId: number): Promise<boolean> {
    try {
      const role = await Role.findByPk(roleId);
      if (role) {
        await role.destroy();
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(`Error deleting role: ${error.message}`);
    }
  }

  async deletePermission(permissionId: number): Promise<boolean> {
    try {
      const permission = await Permission.findByPk(permissionId);
      if (permission) {
        await permission.destroy();
        return true;
      }
      return false;
    } catch (error: any) {
      throw new Error(`Error deleting permission: ${error.message}`);
    }
  }
}

export const RoleService = new roleService();
