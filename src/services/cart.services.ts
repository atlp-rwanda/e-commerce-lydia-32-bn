import CartItem, { CartItemAttributes } from '../models/cartItemModel.js';
import Cart, { CartAttributes } from '../models/cartModel.js';
import Product from '../models/productModel.js';
import { UserAttributes } from '../models/userModel.js';
import { Model } from 'sequelize';

export const viewCart = async (user: UserAttributes) => {
  let userCart;
  try {
    userCart = await Cart.findOne({
      where: { userId: user.id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });
    if (!userCart) {
      userCart = await Cart.create({ userId: user.id });
    }

    return userCart;
  } catch (error: any) {
    throw new Error(error);
    return;
  }
};
export const addToCart = async (quantity: number, product: Product, user: UserAttributes) => {
  try {
    let cart = await Cart.findOne({ where: { userId: user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: user.id });
      console.log(cart);
    }

    let cartItem = await CartItem.findOne({
      //@ts-ignore
      where: { cartId: cart.dataValues.id, productId: product.dataValues.productId },
    });

    if (cartItem) {
      if (cartItem.dataValues.quantity + quantity > product.dataValues.quantity) {
        throw new Error("Quantity can't exceed product stock");
      } else {
        await CartItem.update(
          { quantity: cartItem.dataValues.quantity + quantity },
          { where: { id: cartItem.dataValues.id, productId: product.dataValues.productId } },
        );
      }
    } else {
      cartItem = await CartItem.create({
        //@ts-ignore
        cartId: cart.dataValues.id,
        productId: product.dataValues.productId,
        quantity,
      });
    }

    const total = await CartItem.findAll({
      //@ts-ignore
      where: { cartId: cart.dataValues.id },
      include: [{ model: Product, as: 'product' }],
    })
      .then((cartItems) => {
        return cartItems.reduce((acc, item) => {
          if (item.dataValues.product) {
            return acc + item.dataValues.quantity * item.dataValues.product.price;
          } else {
            return acc;
          }
        }, 0);
      })
      .catch((err) => {
        console.error('Error calculating total:', err);
        return 0;
      });

    //@ts-ignore
    await Cart.update({ total }, { where: { id: cart.dataValues.id } });

    return cart;
  } catch (error: any) {
    console.error('Error from add to cart:', error.message);
    throw new Error(error.message);
  }
};

export const updateCartItem = async (cartItemId: number, quantity: number) => {
  console.log(`updateCartItem called with cartItemId: ${cartItemId}, quantity: ${quantity}`);

  if (isNaN(quantity) || quantity <= 0) {
    throw new Error('Invalid quantity');
  }

  try {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    const product = await Product.findByPk(cartItem.dataValues.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (quantity > product.dataValues.quantity) {
      throw new Error("Quantity can't exceed product stock");
    }

    await cartItem.update({ quantity });

    // Return the updated cartItem
    return await CartItem.findByPk(cartItemId, {
      include: [{ model: Product, as: 'product' }],
    });
  } catch (error: any) {
    console.error('Error updating cart item:', error.message);
    throw new Error(error.message);
  }
};

export const deleteCartItem = async (cartItemId: number) => {
  console.log(`deleteCartItem called with cartItemId: ${cartItemId}`);

  try {
    const cartItem = await CartItem.findByPk(cartItemId);
    if (!cartItem) {
      throw new Error('Cart item not found');
    }

    await CartItem.destroy({ where: { id: cartItemId } });

    return cartItem;
  } catch (error: any) {
    console.error('Error deleting cart item:', error.message);
    throw new Error(error.message);
  }
};
