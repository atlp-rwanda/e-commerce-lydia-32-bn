import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';
import Product, { ProductCreationAttributes } from './productModel.js';

export interface CartItemAttributes {
  id?: number;
  cartId: number | undefined;
  productId: number | undefined;
  quantity: number;
  product?: ProductCreationAttributes;
}

class CartItem extends Model<CartItemAttributes> implements CartItemAttributes {
  id!: number | undefined;

  cartId!: number;

  productId!: number;

  quantity!: number;

  product?: ProductCreationAttributes;
}

CartItem.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    cartId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    productId: {
      allowNull: false,
      type: DataTypes.NUMBER,
      references: {
        model: Product,
        key: 'id',
      },
    },
    quantity: {
      allowNull: false,
      type: DataTypes.NUMBER,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: 'cartItems',
  },
);

CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });

export default CartItem;
