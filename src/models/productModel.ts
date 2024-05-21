import { DataTypes, Model, Optional,Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import User from '../models/userModel.js'


interface ProductAttributes {
  productId: number;
  userId: number;
  productName: string;
  description: string;
  productCategory: string;
  price: number;
  quantity: number;
  images: string[];
  dimensions?: string;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define a type for creation attributes that omits productId and other optional fields
export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId' | 'isAvailable' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public productId!: number;
  public userId!: number;
  public productName!: string;
  public description!: string;
  public productCategory!: string;
  public price!: number;
  public quantity!: number;
  public images: string[] = [];
  public dimensions?: string;
  public isAvailable?: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Product.belongsTo(User, { foreignKey: 'userId', as: 'seller', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
  }

  static initialize(sequelize: Sequelize) {
    Product.init(
      {
        productId: {
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
          onDelete: 'SET NULL',
          onUpdate: 'SET NULL',
        },
        productName: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        productCategory: {
          type: DataTypes.STRING(128),
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        images: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          validate: {
          len: [4, 8], 
            },
        },
        dimensions: { 
        type: DataTypes.STRING(128),
        },
        isAvailable: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
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
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
      }
    );
  }
}

export  {Product};