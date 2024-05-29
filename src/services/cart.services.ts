import Cart from '../models/cartModel.js';
import CartItem from '../models/cartItemModel.js';
import Product from '../models/productModel.js';

/**
 * Adds a product to the user's cart.
 * 
 * @param {number} userId - The ID of the user.
 * @param {number} productId - The ID of the product to add.
 * @param {number} quantity - The quantity of the product to add.
 * @param {string} [dimensions] - Optional dimensions of the product.
 * @returns {Promise<CartItem>} The created CartItem instance.
 */
export async function addToCart(userId: number, productId: number, quantity: number, dimensions?: string): Promise<CartItem> {
  // Find the product to ensure it exists
  const product = await Product.findByPk(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Find or create the cart for the user
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }

  // Check if the product already exists in the cart
  let cartItem = await CartItem.findOne({ where: { cartId: cart.cartId, productId } });
  if (cartItem) {
    // Update the quantity if the item already exists
    cartItem.quantity += quantity;
    if (dimensions) {
      cartItem.dimensions = dimensions;
    }
    await cartItem.save();
  } else {
    // Create a new cart item if it doesn't exist
    cartItem = await CartItem.create({
      cartId: cart.cartId,
      productId,
      quantity,
      dimensions,
    });
  }

  return cartItem;
}
