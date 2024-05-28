// services/roleService.ts
import User from '../../models/userModel.js';
import Role from '../../models/roleModel.js';
import Permission from '../../models/permissionModel.js';
import RolePermission from '../../models/rolePermissionModel.js';
import { rolePermissions, permissions, PermissionKey } from '../../utilis/roles/roles.util.js';

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
    if (!name) {
      throw new Error('Permission name is required');
    }

    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      throw new Error('Permission already exists');
    }

    const permission = await Permission.create({ name });
    return permission;
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
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

export const RoleService = new roleService();
