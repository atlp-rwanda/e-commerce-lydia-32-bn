import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface CartAttributes {
  cartId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'cartId' | 'createdAt' | 'updatedAt'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
  public cartId!: number;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Cart.init(
  {
    cartId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'Cart',
    tableName: 'carts',
  }
);

export default Cart;
