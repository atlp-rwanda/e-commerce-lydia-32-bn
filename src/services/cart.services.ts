
import CartItem, { CartItemAttributes } from "../models/cartItemModel.js";
import Cart, { CartAttributes } from "../models/cartModel.js";
import Product from "../models/productModel.js";
import { UserAttributes } from "../models/userModel.js";
import { Model } from "sequelize";

export const viewCart = async (user: UserAttributes) => {
  let userCart;

  let isNew: boolean = false;
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
      isNew = true;
      userCart = await Cart.create({ userId: user.id });
    }

    return { userCart, isNew };
  } catch (error) {
    throw new Error(error as never);
  }
};
export const addTocart = async (quantity: number, product: Product, user: UserAttributes) => {
  let cart: CartAttributes | null;
  try {
    cart = await Cart.findOne({ where: { userId: user?.id } });

    if (!cart) {
      cart = await Cart.create({ userId: user?.id });
      return cart;
    }

    let cartItem = await CartItem.findOne({ where: { cartId: cart?.id, productId: product.productId } });

    if (cartItem) {
      if (cartItem.quantity + quantity > product.quantity) {
        throw new Error("Quantity can't exceed product stock");
        
      } else {
        await CartItem.update(
          { quantity: cartItem.quantity + quantity },
          {
            where: { id: cartItem.id, productId: product.productId},
          },
        );
      }
    } else {
      cartItem = await CartItem.create({ cartId: cart.id, productId: product.productId, quantity });
    }
    const total = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [{ model: Product, as: "product" }],
    })
      .then((cartItems) => {
        return cartItems.reduce((acc, item: CartItemAttributes) => {
          if (item.product) {
            return acc + item.quantity * item.product.price;
          } else {
            return acc;
          }
        }, 0);
      })
      .catch((err) => {
        console.error("Error calculating total:", err);
        return 0;
      });

    await Cart.update({total: total }, { where: { id: cart.id } });

    return cart;
  } catch (error: any) {
    throw new Error(error)
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