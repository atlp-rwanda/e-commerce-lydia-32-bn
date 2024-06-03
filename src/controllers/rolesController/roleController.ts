// controllers/roleController.ts
import { Request, Response } from 'express';
import { RoleService } from '../../services/roles/roleService.js';
import Role from '../../models/roleModel.js';
import { UserService } from '../../services/registeruser.service.js';
import RolePermission from '../../models/rolePermissionModel.js';
import Permission from '../../models/permissionModel.js';

class roleController {
  async createRole(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const role = await Role.findOne({
      where: { name },
    });

    if (role) {
      return res.status(400).json({ error: 'Role already exists' });
    }

    try {
      const role = await Role.create({ name });
      return res.status(201).json({ message: 'Role created successfully', role });
    } catch (error: any) {
      return res.status(500).json({ message: `Error creating role: ${error.message}` });
    }
  }

  getAllRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
      const roles = await RoleService.getAllRoles();
      return res.status(200).json({ message: 'Roles Retrieved succesfully', roles });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  getRoleById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const roleId = parseInt(req.params.id, 10);
      const role = await RoleService.getRoleById(roleId);
      if (role) {
        return res.status(200).json({ message: 'Role Retrieved succesfully', role });
      }
      return res.status(404).json({ error: 'Role not found' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };

  async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    try {
      const role = await RoleService.updateRole(parseInt(id, 10), { name });
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
      return res.status(200).json({ message: 'Role updated successfully', role });
    } catch (error: any) {
      return res.status(500).json({ message: `Error updating role: ${error.message}` });
    }
  }

  async createPermission(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Permission name is required' });
    }

    const permission = await Permission.findOne({
      where: { name },
    });

    if (permission) {
      return res.status(400).json({ error: 'Permission already exists' });
    }

    try {
      const permission = await RoleService.createPermission(name);
      return res.status(201).json({ message: 'Permission created successfully', permission });
    } catch (error: any) {
      return res.status(500).json({ message: `Error creating permission: ${error.message}` });
    }
  }

  async addPermission(req: Request, res: Response) {
    const roleId = parseInt(req.params.id, 10);
    const { permissionId } = req.body;

    if (isNaN(roleId) || typeof permissionId !== 'number') {
      return res.status(400).json({ message: 'Invalid role ID or permission ID' });
    }

    const rolePermission = await RolePermission.findOne({
      where: { roleId, permissionId },
    });

    if (rolePermission) {
      return res.status(400).json({ error: 'Permission already assigned to this role' });
    }

    try {
      await RoleService.addPermissionToRole(roleId, permissionId);
      const role = await RoleService.getRoleById(roleId);
      return res.status(200).json({ message: 'Permission added successfully', role });
    } catch (error: any) {
      return res.status(400).json({ message: `Error adding permission: ${error.message}` });
    }
  }

  async removePermission(req: Request, res: Response) {
    const roleId = parseInt(req.params.id, 10);
    const { permissionId } = req.body;

    if (isNaN(roleId) || typeof permissionId !== 'number') {
      return res.status(400).json({ message: 'Invalid role ID or permission ID' });
    }

    try {
      await RoleService.removePermissionFromRole(roleId, permissionId);
      return res.status(200).json({ message: 'Permission removed successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: `Error removing permission: ${error.message}` });
    }
  }

  async assignRoleToUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      const { roleId } = req.body;

      if (isNaN(userId) || !roleId) {
        return res.status(400).json({ message: 'Invalid user ID or role ID' });
      }

      const user = await UserService.getUserById(userId);
      const role = await RoleService.getRoleById(roleId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      if (user.roleId === roleId) {
        return res.status(400).json({ message: 'User already has this role' });
      }

      const updatedUser = await UserService.updateUser(userId, { roleId });
      return res.status(200).json({ message: 'Role assigned to user successfully' });
    } catch (error: any) {
      return res.status(500).json({ message: `Error assigning role to user: ${error.message}` });
    }
  }

  deleteRole = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.id, 10);
      const deleted = await RoleService.deleteRole(userId);
      if (deleted) {
        return res.status(200).json({ message: 'Role deleted successfully' });
      }
      return res.status(404).json({ error: 'Role not found' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  };
}

export const RoleController = new roleController();
