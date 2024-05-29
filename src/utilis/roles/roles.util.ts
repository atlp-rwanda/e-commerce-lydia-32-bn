export const roles = {
  ADMIN: 'admin',
  BUYER: 'buyer',
  MERCHANT: 'merchant',
  GUEST: 'guest',
};

export const permissions = {
  MANAGE_USERS: 'manage_users',
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_PRODUCTS: 'view_products',
  MANAGE_ORDERS: 'manage_orders',
  VIEW_ORDERS: 'view_orders',
  PLACE_ORDERS: 'place_orders',
} as const;

export type PermissionKey = (typeof permissions)[keyof typeof permissions];

export const rolePermissions: Record<string, PermissionKey[]> = {
  [roles.ADMIN]: [
    permissions.MANAGE_USERS,
    permissions.MANAGE_PRODUCTS,
    permissions.MANAGE_ORDERS,
    permissions.VIEW_PRODUCTS,
    permissions.VIEW_ORDERS,
    permissions.MANAGE_ORDERS,
  ],
  [roles.BUYER]: [permissions.VIEW_PRODUCTS, permissions.PLACE_ORDERS, permissions.VIEW_ORDERS],
  [roles.MERCHANT]: [permissions.MANAGE_PRODUCTS, permissions.VIEW_PRODUCTS, permissions.VIEW_ORDERS],
};
