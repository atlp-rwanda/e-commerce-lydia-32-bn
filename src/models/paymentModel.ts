import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';
import Order from './orderModel.js';

export enum PaymentStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
  Canceled = 'Canceled',
  Refunded = 'Refunded',
}

export enum PaymentMethod {
  Stripe = 'Stripe',
  MOMO = 'MOMO',
}

interface PaymentAttributes {
  id: number;
  stripeId: string;
  userId: number;
  orderId: number;
  amount: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;

  public stripeId!: string;

  public userId!: number;

  public orderId!: number;

  public amount!: number;

  public currency!: string;

  public payment_method!: PaymentMethod;

  public payment_status!: PaymentStatus;

  public createdAt!: Date;

  public updatedAt!: Date;

  static associate(models: any) {
    Payment.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    Payment.belongsTo(Order, {
      foreignKey: 'orderId',
      as: 'order',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }

  static initialize(sequelize: Sequelize) {
    Payment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        stripeId: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        userId: {
          type: new DataTypes.INTEGER(),
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        orderId: {
          type: new DataTypes.INTEGER(),
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        amount: {
          type: new DataTypes.FLOAT,
          allowNull: false,
        },
        currency: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        payment_method: {
          type: DataTypes.ENUM,
          values: ['Stripe', 'MOMO'],
        },
        payment_status: {
          type: DataTypes.ENUM,
          values: ['Pending', 'Completed', 'Failed', 'Refunded', 'Canceled'],
          defaultValue: PaymentStatus.Pending,
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
      },
    );
  }
}

Payment.initialize(sequelize);
export default Payment;
