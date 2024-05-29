import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface CartItemAttributes {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  dimensions?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CartItemCreationAttributes extends Optional<CartItemAttributes, 'cartItemId' | 'createdAt' | 'updatedAt'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> implements CartItemAttributes {
  public cartItemId!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public dimensions?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

CartItem.init(
  {
    cartItemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'carts',
        key: 'cartId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'productId',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    dimensions: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cart_items',
  }
);

export default CartItem;
