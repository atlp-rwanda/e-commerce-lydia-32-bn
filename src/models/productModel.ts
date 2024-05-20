import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.js';

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  expiry_date?: Date;
  bonus?: string;
  images: string[];
  dimensions?: string;
  seller_id: number;
}



interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'expiry_date' | 'bonus'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public expiry_date?: Date;
  public bonus?: string;
  public images!: string[];
  public dimensions?: string;
  public seller_id!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
    },
    bonus: {
      type: DataTypes.STRING(128),
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
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    tableName: 'products',
    sequelize,
  }
);

export {Product, ProductAttributes, ProductCreationAttributes};
