import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./userModel.js";
import CartItem from "./cartItemModel.js";

export interface CartAttributes {
  id?: number;
  userId: number | undefined;
  total: number;
  items?: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

class Cart extends Model<CartAttributes | {}> implements CartAttributes {
  id!: number | undefined;
  userId!: number;
  items!: CartItem[];
  total!: number;
  createdAt!: Date | undefined;
  updatedAt!: Date | undefined;
}

Cart.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.NUMBER,
    },
    total: {
      allowNull: false,
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "carts",
  },
);

Cart.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });

export default Cart;