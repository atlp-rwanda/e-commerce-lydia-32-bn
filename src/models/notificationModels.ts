import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import User from './userModel.js';

interface NotificationAttributes {
  id: number;
  userId: number;
  message: string;
  readstatus: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'createdAt'> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public userId!: number;
  public message!: string;
  public readstatus!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Notification.belongsTo(User, {
      foreignKey: 'userId',
      as: 'user',
    });
  }

  static initialize(sequelize: Sequelize) {
    Notification.init(
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
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        message: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        readstatus: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'Notification',
        tableName: 'notifications',
      },
    );
  }
}

Notification.initialize(sequelize);

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
export default Notification;