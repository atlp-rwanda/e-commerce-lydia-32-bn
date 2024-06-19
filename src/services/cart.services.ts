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

    let totalPrice = 0;
    let cartData;
    if (userCart) {
      const { items, userId, id } = (userCart as any).dataValues;
      if (items && Array.isArray(items)) {
        if (items.length === 0) {
          
          return { message: 'Your cart is empty', cart: {
            userId: user.id,
            total: 0,
            items: []
          } };
        }

        items.forEach((item: any) => {
          const productPrice = Number(item.dataValues.product.dataValues.price);
          const productQuantity = Number(item.dataValues.quantity);
          const price = productPrice * productQuantity;
          totalPrice += price;
        });

        await userCart.update({ total: totalPrice });

        cartData = {
          id,
          buyerId: userId,
          total: totalPrice,
          items: items.map((item: any) => ({
            id: item.dataValues.id,
            productId: item.dataValues.productId,
            quantity: item.dataValues.quantity,
            images: item.dataValues.product.dataValues.images,
            productName: item.dataValues.product.dataValues.productName,
          }))}
      } else {
        console.error('Items is undefined or not an array');
      }
    } else {
      return { message: 'Your cart is empty', cart: {
        userId: user.id,
        total: 0,
        items: []
      } };
    }

    return cartData;
  } catch (error: any) {
    throw new Error(error.message || error);
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
      // @ts-ignore
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
        // @ts-ignore
        cartId: cart.dataValues.id,
        productId: product.dataValues.productId,
        quantity,
      });
    }

    const total = await CartItem.findAll({
      // @ts-ignore
      where: { cartId: cart.dataValues.id },
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

    // @ts-ignore
    await Cart.update({ total }, { where: { id: cart.dataValues.id } });
      
    interface CartDataValues {
      id: number;
      userId: number;
      total?: number;
    }
    const newCart = {
      id: (cart.dataValues as CartDataValues).id,
      buyerId: (cart.dataValues as CartDataValues).userId,
      productId: product.dataValues.productId,
    };

    return newCart;
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
    return await CartItem.findByPk(cartItemId);
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

export const deleteCart = async (user: UserAttributes) => {
  try {
    const userCart = await Cart.findOne({ where: { userId: user.id } });
   
      //@ts-ignore
     if(userCart?.dataValues.id === undefined){
      return {message: 'you have no cart to delete'}
     }

    await userCart?.destroy();
    return {
      //@ts-ignore
      id: userCart.dataValues.id,
      userId: user.id,
      items:[]
    }
  } catch (error: any) {
    console.log('Error deleting cart', error.message);
    throw new Error(error.message);
  }
};
