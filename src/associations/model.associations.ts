// models/modelAssociations.ts
import WishList from '../models/wishListModels.js';
import Product from '../models/productModel.js';
import Review from '../models/review.js';
import User from '../models/userModel.js';

export function setupAssociations() {
  User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
  User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });

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
  Product.hasMany(Review, {
    foreignKey: 'productId',
    as: 'reviews',
  });

  Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Review.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  WishList.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
}
