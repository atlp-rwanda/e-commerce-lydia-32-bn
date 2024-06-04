import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../config/db';
import User from './userModel';

export interface OrderAttributes {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public userId!: number;
  public totalAmount!: number;
  public status!: string;
  public paymentMethod!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Order.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Order.hasMany(models.Payment, { foreignKey: 'orderId', as: 'payments' });
  }

  static initialize(sequelize: Sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: new DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        totalAmount: {
          type: new DataTypes.INTEGER,
          allowNull: false,
        },
        status: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        paymentMethod: {
          type: new DataTypes.STRING(128),
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
        modelName: 'Order',
        tableName: 'orders',
      }
    );
  }
}

Order.initialize(sequelize);
export default Order;
