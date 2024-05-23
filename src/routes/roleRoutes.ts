import { isRoleAdmin } from '../middleware/checkAdminRoleMiddleware.js';
import { RoleController } from '../controllers/rolesController/roleController.js';
import express from 'express';

export const rolesRouter = express.Router();

/**
 * @swagger
 * /api/roles/create:
 *   post:
 *     summary: Create user role
 *     description: Create a new role
 *     tags: [Roles]
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
rolesRouter.post('/roles/create', RoleController.createRole);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     description: Retrieve a list of all roles
 *     tags: [Roles]
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
 *     tags: [Roles]
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
rolesRouter.get('/roles/:id', RoleController.getRoleById);

/**
 * @swagger
 * /api/roles/update/{id}:
 *   put:
 *     summary: Update role by ID
 *     description: Update an existing role by its ID
 *     tags: [Roles]
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
rolesRouter.put('/roles/update/:id', RoleController.updateRole);

/**
 * @swagger
 * /api/roles/delete/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     description: Delete a role by its ID
 *     tags: [Roles]
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
rolesRouter.delete('/roles/delete/:id', RoleController.deleteRole);

/**
 * @swagger
 * /api/roles/permissions/create:
 *   post:
 *     summary: Create a new permission
 *     description: Create a new permission
 *     tags: [Permissions]
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
rolesRouter.post('/roles/permissions/create', RoleController.createPermission);

/**
 * @swagger
 * /api/roles/permissions/add/{id}:
 *   post:
 *     summary: Add a permission to a role
 *     description: Add a permission to a role by role ID
 *     tags: [Permissions]
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
rolesRouter.post('/roles/permissions/add/:id', RoleController.addPermission);

/**
 * @swagger
 * /api/roles/permissions/remove/{id}:
 *   delete:
 *     summary: Remove a permission from a role
 *     description: Remove a permission from a role by role ID
 *     tags: [Permissions]
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
rolesRouter.delete('/roles/permissions/remove/:id', RoleController.removePermission);

/**
 * @swagger
 * /api/roles/assign/{id}:
 *   post:
 *     summary: Assign a role to a user
 *     description: Assign a role to a user by user ID
 *     tags: [Permissions]
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
rolesRouter.post('/roles/assign/:id', RoleController.assignRoleToUser);
