import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import sequelize from '../config/db.js';
import User from '../models/userModel.js';
import notificationEmitter from '../utilis/eventEmitter.js';
import WishList from './wishListModels.js';

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
  expiryDate?: Date;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'productId' | 'isAvailable' | 'createdAt' | 'updatedAt' | 'expiryDate'> {}

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

  public expiryDate!: Date;

  static associate(models: any) {
    Product.belongsTo(User, {
      foreignKey: 'userId',
      as: 'seller',
      onDelete: 'SET NULL',
      onUpdate: 'SET NULL',
    });
    Product.hasMany(WishList, {
      foreignKey: 'productId',
      as: 'wishlistItems',
    });
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
          type: new DataTypes.INTEGER(),
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
          type: new DataTypes.TEXT(),
          allowNull: false,
        },
        productCategory: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
        price: {
          type: new DataTypes.FLOAT(),
          allowNull: false,
        },
        quantity: {
          type: new DataTypes.INTEGER(),
          allowNull: false,
        },
        images: {
          type: new DataTypes.STRING(),
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
          type: new DataTypes.BOOLEAN(),
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        hooks: {
          afterCreate: (product: Product) => {
            notificationEmitter.emit('productAdded', product);
          },
          afterUpdate: (product: Product) => {
            const previousDataValues = (product as any)._previousDataValues as ProductAttributes;
            if (previousDataValues.isAvailable !== product.dataValues.isAvailable) {
              if (product.dataValues.isAvailable === true) {
                notificationEmitter.emit('productAvailable', product);
              } else {
                notificationEmitter.emit('productUnavailable', product);
              }
            } else {
              notificationEmitter.emit('productUpdated', product);
            }
          },
          afterDestroy: (product: Product) => {
            notificationEmitter.emit('productDeleted', product);
          },
        },
      },
    );
  }
}

Product.initialize(sequelize);
export default Product;
