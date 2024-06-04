import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db';
import User from './userModel';
import Order from './orderModel';

interface PaymentAttributes {
  id: number;
  stripePaymentId: string;
  userId: number;
  orderId: number;
  amount: number;
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public stripePaymentId!: string;
  public userId!: number;
  public orderId!: number;
  public amount!: number;
  public currency!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Payment.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Payment.belongsTo(Order, { foreignKey: 'orderId', as: 'order', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }

  static initialize(sequelize: Sequelize) {
    Payment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        stripePaymentId: {
          type: new DataTypes.STRING(128),
          allowNull: false,
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
        orderId: {
          type: new DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        amount: {
          type: new DataTypes.INTEGER,
          allowNull: false,
        },
        currency: {
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
        modelName: 'Payment',
        tableName: 'payments',
      }
    );
  }
}

Payment.initialize(sequelize);
export default Payment;
