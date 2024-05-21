import User from '../models/userModel.js'
import {Product} from '../models/productModel.js'


Product.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'NULL',
    onUpdate: 'NULL',
  });

