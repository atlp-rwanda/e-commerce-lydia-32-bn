// import { isRoleAdmin } from '../middleware/checkAdminRoleMiddleware.js';
import express from 'express';
import { isRoleAdmin } from '../middleware/checkAdminRoleMiddleware.js';
import { RoleController } from '../controllers/rolesController/roleController.js';

export const rolesRouter = express.Router();

/**
 * @swagger
 * /api/roles/create:
 *   post:
 *     summary: Create user role
 *     description: Create a new role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       '201':
 *         description: Role created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       '400':
 *         description: Role name is required or Role already exists
 *       '500':
 *         description: Internal server error
 */
rolesRouter.post('/roles/create',isRoleAdmin, RoleController.createRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all roles
 *     tags: [Role]
 *     responses:
 *       '200':
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       '500':
 *         description: Internal server error
 */
rolesRouter.get('/roles', isRoleAdmin, RoleController.getAllRoles);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all roles
 *     tags: [Role]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       '500':
 *         description: Internal server error
 */
rolesRouter.get('/roles/:id', isRoleAdmin, RoleController.getRoleById);

/**
 * @swagger
 * /api/roles/update/{id}:
 *   put:
 *     summary: Update role by ID
 *     description: Update an existing role by its ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       '200':
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal server error
 */
rolesRouter.put('/roles/update/:id', isRoleAdmin, RoleController.updateRole);

/**
 * @swagger
 * /api/roles/delete/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     description: Delete a role by its ID
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Role ID
 *     responses:
 *       '200':
 *         description: Role deleted successfully
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal server error
 */
rolesRouter.delete('/roles/delete/:id', isRoleAdmin, RoleController.deleteRole);

/**
 * @swagger
 * /api/roles/permissions/create:
 *   post:
 *     summary: Create a new permission
 *     description: Create a new permission
 *     tags: [Permission]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       '201':
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       '400':
 *         description: Permission name is required or Permission already exists
 *       '500':
 *         description: Internal server error
 */
rolesRouter.post('/roles/permissions/create', isRoleAdmin, RoleController.createPermission);

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Get all permissions
 *     description: Retrieve a list of all permissions
 *     tags: [Permission]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       '500':
 *         description: Internal server error
 */
rolesRouter.get('/permissions', isRoleAdmin, RoleController.getAllPermissions);

/**
 * @swagger
 * /api/roles/permissions/add/{id}:
 *   post:
 *     summary: Add a permission to a role
 *     description: Add a permission to a role by role ID
 *     tags: [Permission]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Role ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       '200':
 *         description: Permission added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal server error
 */
rolesRouter.post('/roles/permissions/add/:id', isRoleAdmin, RoleController.addPermission);

/**
 * @swagger
 * /api/roles/permissions/remove/{id}:
 *   delete:
 *     summary: Remove a permission from a role
 *     description: Remove a permission from a role by role ID
 *     tags: [Permission]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       '200':
 *         description: Permission removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Role not found
 *       '500':
 *         description: Internal server error
 */
rolesRouter.delete('/roles/permissions/remove/:id', isRoleAdmin, RoleController.removePermission);

/**
 * @swagger
 * /api/roles/assign/{id}:
 *   post:
 *     summary: Assign a role to a user
 *     description: Assign a role to a user by user ID
 *     tags: [Permission]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       '200':
 *         description: Role assigned to user successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid request
 *       '404':
 *         description: Role or User not found
 *       '500':
 *         description: Internal server error
 */
rolesRouter.post('/roles/assign/:id', isRoleAdmin, RoleController.assignRoleToUser);
/**
 * @swagger
 * /api/permissions/delete/{permissionId}:
 *   delete:
 *     summary: Delete a permission
 *     description: Endpoint to delete a permission.
 *     tags: [Permission]
 *     parameters:
 *       - in: path
 *         name: permissionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of permission to be deleted
 *     responses:
 *       '200':
 *         description: Permission deleted successfully
 *       '404':
 *         description: Permission not found
 *       '500':
 *         description: Internal server error
 */
rolesRouter.delete('/permissions/delete/:id', RoleController.deletePermission);
