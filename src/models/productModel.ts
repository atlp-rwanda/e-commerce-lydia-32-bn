import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import User from '../models/userModel.js';

interface ProductAttributes {
  productId: number;
  userId: number;
  productName: string;
  description: string;
  productCategory: string;
  price: number;
  quantity: number;
  images: string;
  dimensions?: string;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'productId' | 'isAvailable' | 'createdAt' | 'updatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public productId!: number;
  public userId!: number;
  public productName!: string;
  public description!: string;
  public productCategory!: string;
  public price!: number;
  public quantity!: number;
  public images!: string;
  public dimensions?: string;
  public isAvailable?: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;

  static associate(models: any) {
    Product.belongsTo(User, { foreignKey: 'userId', as: 'seller', onDelete: 'SET NULL', onUpdate: 'SET NULL' });
    Product.belongsToMany(models.WishList, { through: models.WishListProduct, foreignKey: 'productId', as: 'wishLists' });
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
          type: new DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'SET NULL',
          onUpdate: 'SET NULL',
        },
        productName: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        description: {
          type: new DataTypes.TEXT,
          allowNull: false,
        },
        productCategory: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        price: {
          type: new DataTypes.FLOAT,
          allowNull: false,
        },
        quantity: {
          type: new DataTypes.INTEGER,
          allowNull: false,
        },
        images: {
          type: new DataTypes.STRING,
          allowNull: false,
          get() {
            const value = this.getDataValue('images');
            return value ? value.split(',') : [];
          },
          set(val: string | string[]) {
            if (Array.isArray(val)) {
              this.setDataValue('images', val.join(','));
            } else {
              this.setDataValue('images', val);
            }
          },
        },
        dimensions: {
          type: new DataTypes.STRING(128),
        },
        isAvailable: {
          type: new DataTypes.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
      }
    );
  }
}

Product.initialize(sequelize);
export default Product;