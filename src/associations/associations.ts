import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import CartItem from '../models/cartItemModel.js';

Product.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'NULL',
  onUpdate: 'NULL',
});

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
