// orderService.ts
import Order from '../../models/orderModel.js';
import Cart from '../../models/cartModel.js';
import CartItem from '../../models/cartItemModel.js';
import Product from '../../models/productModel.js';
import User from '../../models/userModel.js';
import { UserAttributes } from '../../models/userModel.js';

interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export const addToOrder = async (currentUser: any, payment: any, address: AddressData[]) => {
  try {
    console.log('my user id is', currentUser.id); 
    let cart: any = await Cart.findOne({
      where: { userId: currentUser.id },
    });

    console.log('my cart total is', cart.dataValues.total);
    const order = await Order.create({
      userId: currentUser.id,
      totalAmount: cart.dataValues.total,
      status: "pending",
      payment: payment,
      address: address 
    });

    return order;
  } catch (error: any) {
    console.error('Error from add to cart:', error.message);
    throw new Error(error.message);
  }
};