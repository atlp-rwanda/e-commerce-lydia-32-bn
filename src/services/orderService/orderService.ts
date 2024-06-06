import Order from '../../models/orderModel.js';
import Cart from '../../models/cartModel.js';
import CartItem from '../../models/cartItemModel.js'; // Import CartItem model
import Product from '../../models/productModel.js';

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
    console.log('my cart is', cart)
    let totalPrice = 0;
    if (cart) {
      const { items } = (cart as any).dataValues;
      if (items && Array.isArray(items)) {
       

        items.forEach((item: any) => {
          const productPrice = Number(item.dataValues.product.dataValues.price);
          const productQuantity = Number(item.dataValues.quantity);
          const price = productPrice * productQuantity;
          totalPrice += price;
        });

        await cart.update({ total: totalPrice });
      } 
    }
    const order = await Order.create({
      userId: currentUser.id,
      products: cart.dataValues.items,
      totalAmount: cart.dataValues.total,
      totalPaid: 0,
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