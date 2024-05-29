
import CartItem, { CartItemAttributes } from "../models/cartItemModel.js";
import Cart, { CartAttributes } from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { UserAttributes } from "../models/userModel.js";
import { Model } from "sequelize";

export const viewCart = async (user: UserAttributes) => {
  let userCart;
  try {
    userCart = await Cart.findOne({
      where: { userId: user.id },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });
    if (!userCart) {
      userCart = await Cart.create({ userId: user.id });
    }

    return userCart
  } catch (error: any) {
  
    throw new Error(error);
    return
  }
};
export const addToCart = async (quantity: number, product: Product, user: UserAttributes) => {
  try {
    let cart = await Cart.findOne({ where: { userId: user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: user.id });
      console.log(cart)
    }

    //@ts-ignore
    let cartItem = await CartItem.findOne({ where: { cartId: cart.dataValues.id, productId: product.dataValues.productId } });

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
      //@ts-ignore
      cartItem = await CartItem.create({ cartId: cart.dataValues.id, productId: product.dataValues.productId, quantity });
    }

    const total = await CartItem.findAll({
      //@ts-ignore
      where: { cartId: cart.dataValues.id },
      include: [{ model: Product, as: 'product' }],
    })
      .then((cartItems) => {
        return cartItems.reduce((acc, item) => {
          if (item.dataValues.product) {
            //@ts-ignore
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

export const removeFromCart = async (productId: number, userCart: Model<CartAttributes>) => {
  try {
    //@ts-ignore
    const cartItem: CartItemAttributes = await CartItem.findOne({ where: { productId: productId }, include: [{ model: Product, as: "product" }] });
    const subTotal = cartItem?.quantity * cartItem!.product!.price;
    await userCart.decrement("total", { by: subTotal });
    await CartItem.destroy({ where: { productId: productId } });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const updateCart = async (quantity: number, productId: number, user: UserAttributes) => {
  try {
    //@ts-ignore
    const cartItem: CartItemAttributes = await CartItem.findOne({ where: { productId: productId }, include: [{ model: Product, as: "product" }] });
    const subTotal = quantity * cartItem!.product!.price;
    await CartItem.update({ quantity }, { where: { productId } });
    await Cart.update({ total: subTotal }, { where: { userId: user.id } });

    return true;
  } catch (error) {
    throw new Error(error as any);
  }
};

export const clearCart = async (user: UserAttributes) => {
  try {
    const userCart = await Cart.findOne({
      where: { userId: user.id },
      include: [
        {
          model: CartItem,
          as: "items",
        },
      ],
    });

    if (!userCart || !userCart.items || userCart.items.length < 1) {
      return false;
    }
    await CartItem.destroy({ where: { cartId: userCart?.id } });
    await Cart.update({ total: 0 }, { where: { userId: user.id } });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};