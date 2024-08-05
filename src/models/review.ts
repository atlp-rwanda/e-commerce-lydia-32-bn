import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelise from '../config/db.js';

export interface ReviewAttributes {
  id: number;
  userId: number;
  productId: number;
  RatingValue: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public userId!: number;
  public productId!: number;
  public RatingValue!: number;
  public review!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Review.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
  }
}

Review.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
    },
    productId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    RatingValue: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    review: {
      allowNull: true,
      type: DataTypes.STRING,
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
    sequelize: sequelise,
    modelName: 'Review',
    tableName: 'reviews',
  },
);

export default Review;
