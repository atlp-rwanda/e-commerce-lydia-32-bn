// orderService.ts
import Order from '../../models/orderModel.js';
import Cart from '../../models/cartModel.js';
import CartItem from '../../models/cartItemModel.js';
import Product from '../../models/productModel.js';
import User from '../../models/userModel.js';
import { UserAttributes } from '../../models/userModel.js';



export const addToOrder = async (currentUser: any, payment: any, address: any) => {
  try {
console.log('my user id is', currentUser.dataValues.id)
    let cart: any = await Cart.findOne({

      //@ts-ignore
      where: { userId: currentUser.dataValues.id },
    
    });
console.log('my cart total is', cart.dataValues.total)
    const order = await Order.create({
      userId: currentUser.dataValues.id,
      totalAmount: cart.dataValues.total,
      status: "pending",
      payment: payment,
      address: address
    })
 return order


  } catch (error: any) {
    console.error('Error from add to cart:', error.message);
    throw new Error(error.message);
  }
};
