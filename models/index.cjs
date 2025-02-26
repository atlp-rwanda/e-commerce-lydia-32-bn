import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import User from './userModel';
import Product from './productModel';
import WishList from './wishListModels';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export function initializeAssociations() {
  User.associate({ Product, WishList });
  Product.associate({ User, WishList });
  WishList.associate({ User, Product });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
