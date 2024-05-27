import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

interface WishListAttributes {
  id: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WishListCreationAttributes extends Optional<WishListAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class WishList extends Model<WishListAttributes, WishListCreationAttributes> implements WishListAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    WishList.belongsTo(User, { foreignKey: 'userId', as: 'buyer', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    WishList.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
  }

  static initialize(sequelize: Sequelize) {
    WishList.init(
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
      },
      {
        sequelize,
        modelName: 'WishList',
        tableName: 'wishlists',
      }
    );
  }
}

WishList.initialize(sequelize);
export default WishList;
