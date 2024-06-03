import { Model } from 'sequelize';
import CartItem, { CartItemAttributes } from '../models/cartItemModel.js';
import Cart, { CartAttributes } from '../models/cartModel.js';
import Product from '../models/productModel.js';
import { UserAttributes } from '../models/userModel.js';

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
      where: { cartId: (cart as any).dataValues.id, productId: product.dataValues.productId },
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
        cartId: (cart as any).dataValues.id,
        productId: product.dataValues.productId,
        quantity,
      });
    }

    const total = await CartItem.findAll({
      where: { cartId: (cart as any).dataValues.id },
      include: [{ model: Product, as: 'product' }],
    })
      .then((cartItems) =>
        cartItems.reduce((acc, item) => {
          if (item.dataValues.product) {
            return acc + item.dataValues.quantity * item.dataValues.product.price;
          }
          return acc;
        }, 0),
      )
      .catch((err) => {
        console.error('Error calculating total:', err);
        return 0;
      });

    await Cart.update({ total }, { where: { id: (cart as any).dataValues.id } });

    return cart;
  } catch (error: any) {
    console.error('Error from add to cart:', error.message);
    throw new Error(error.message);
  }
};