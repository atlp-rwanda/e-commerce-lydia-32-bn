import Order from '../../models/orderModel.js';
import Cart from '../../models/cartModel.js';
import CartItem from '../../models/cartItemModel.js'; // Import CartItem model
import { ORDER_STATUS } from '../../utilis/orderStatusConstants.js';

interface AddressData {
  country: string;
  city: string;
  street: string;
}

export const addToOrder = async (currentUser: any, payment: any, address: AddressData[]) => {
  try {
    console.log('my user id is', currentUser.id);

    let cart: any = await Cart.findOne({
      where: { userId: currentUser.id },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    // Check if the cart has items
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.dataValues.id }
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    console.log('my cart total is', cart.dataValues.total);
    const order = await Order.create({
      userId: currentUser.id,
      totalAmount: cart.dataValues.total,
      status: "pending",
      payment: payment,
      address: address
    });

    await CartItem.destroy({
      where: { cartId: cart.dataValues.id }
    });

    return order;
  } catch (error: any) {
    console.error('Error from add to order:', error.message);
    throw new Error(error.message);
  }
};



export const getOrderByIdAndBuyerId = async (orderId: string, buyerId: number) => {
  return await Order.findOne({
    where: {
      id: orderId,
      userId: buyerId,
    },
  });
};

export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
  
  if (!Object.values(ORDER_STATUS).includes(orderStatus)) {
    throw new Error('Invalid order status');
  }

  const [, updatedOrders] = await Order.update(
    { status: orderStatus }, 
    {
      where: {
        id: orderId, 
      },
      returning: true, 
    }
  );

  return updatedOrders[0]; 
};
