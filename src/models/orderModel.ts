import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';
import User from '../models/userModel.js';
import notificationEmitter from '../utilis/eventEmitter.js';

interface OrderAttributes {
  id: number;
  userId: number;
  items: any[];
  totalAmount: number;
  status: string;
  payment: string;
  address: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;

  public userId!: number;

  public items!: any[];

  public totalAmount!: number;

  public status!: string;

  public payment!: string;

  public address!: any[];

  public createdAt!: Date;

  public updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    totalAmount: {
      allowNull: false,
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    address: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
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
    modelName: 'orders',
    hooks: {
      afterCreate: (order: Order) => {
        notificationEmitter.emit('orderCreated', order);
        console.log(`Order created: ${order.dataValues.id}`);
      },
      afterUpdate: (order: Order) => {
        notificationEmitter.emit('orderUpdated', order);
        console.log(`Order updated: ${order.dataValues.id}`);
      },
      afterDestroy: (order: Order) => {
        notificationEmitter.emit('orderCancelled', order);
        console.log(`Order canceled: ${order.dataValues.id}`);
      },
    },
  },
);

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

export default Order;
