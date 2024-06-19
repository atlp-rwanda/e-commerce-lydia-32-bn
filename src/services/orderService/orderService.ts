import Order from '../../models/orderModel.js';
import Cart from '../../models/cartModel.js';
import CartItem from '../../models/cartItemModel.js'; // Import CartItem model
import Product from '../../models/productModel.js';
import { OrderStatus } from '../../utilis/orderStatusConstants.js';
import sendEmailMessage from '../../helpers/sendEmail.js';

interface AddressData {
  country: string;
  city: string;
  street: string;
}

export const addToOrder = async (currentUser: any, payment: any, address: AddressData[]) => {
  try {
    console.log('my user id is', currentUser.id);
    const cart: any = await Cart.findOne({
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
    const cartItems = await CartItem.findAll({ where: { cartId: cart.dataValues.id } });
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    let totalPrice = 0;
    let cartData;
    if (cart) {
      const { items, userId, id } = (cart as any).dataValues;
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const productPrice = Number(item.dataValues.product.dataValues.price);
          const productQuantity = Number(item.dataValues.quantity);
          const price = productPrice * productQuantity;
          totalPrice += price;

          const { productId } = item.dataValues.product.dataValues;
          const originalQuantity = item.dataValues.product.dataValues.quantity;
          const quantityToUpdate = originalQuantity - productQuantity;

          if (quantityToUpdate === 0) {
            await Product.update({ quantity: quantityToUpdate, isAvailable: false }, { where: { productId } });
          } else {
            await Product.update({ quantity: quantityToUpdate }, { where: { productId } });
          }

          await item.dataValues.product.reload();
        }
        await cart.update({ total: totalPrice });
        cartData = {
          orderId: id,
          buyerId: userId,
          total: totalPrice,
          items: items.map((item: any) => ({
            id: item.dataValues.id,
            productId: item.dataValues.productId,
            quantity: item.dataValues.quantity,
            images: item.dataValues.product.dataValues.images,
            productName: item.dataValues.product.dataValues.productName,
          })),
        };
      }
    }

    const order = await Order.create({
      userId: currentUser.id,
      items: cart.dataValues.items,
      totalAmount: cart.dataValues.total,
      status: 'pending',
      payment,
      address,
    });

    await CartItem.destroy({ where: { cartId: cart.dataValues.id } });
    const myOrder = {
      id: order.dataValues.id,
      buyerId: order.dataValues.userId,
      items: cartData?.items,
      totalAmount: order.dataValues.totalAmount,
      payment: order.dataValues.payment,
      address: order.dataValues.address,
    };
    const userEmail = currentUser.email;
    const subject = 'Order Confirmation';
    const content = `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order!</p>
      <p>Order ID: ${myOrder.id}</p>
      <p>Total Amount: ${myOrder.totalAmount}</p>
      <!-- Add any additional order details you want to include -->
    `;

    sendEmailMessage(userEmail, subject, content);
    return myOrder;
  } catch (error: any) {
    console.error('Error from add to order:', error.message);
    throw new Error(error.message);
  }
};
export const getOrderByIdAndBuyerId = async (orderId: string, buyerId: number) =>
  await Order.findOne({
    where: {
      id: orderId,
      userId: buyerId,
    },
  });

export const updateOrderStatus = async (orderId: string, inputStatus: OrderStatus) => {
  try {
    const orderStatus = inputStatus as OrderStatus;

    if (!Object.values(OrderStatus).includes(orderStatus)) {
      throw new Error(`Invalid order status: ${orderStatus}`);
    }

    const [affectedRows, updatedOrders] = await Order.update(
      { status: orderStatus },
      {
        where: { id: orderId },
        returning: true,
      },
    );

    if (affectedRows > 0 && updatedOrders.length > 0) {
      return updatedOrders[0].get({ plain: true });
    }
    throw new Error(`Order with ID ${orderId} not found or update failed`);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getSingleOrder = async (id: number) => {
  try {
    // @ts-ignore
    const order = await Order.findByPk(id);

    if (!order) {
      return { message: 'Order Not Found' };
    }

    const { userId, totalAmount, status, payment, address, createdAt, updatedAt } = order.dataValues;

    const formattedOrder = {
      orderId: order.dataValues.id,
      buyerId: userId,
      items: order.dataValues.items.map((item: any) => ({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: {
          images: item.product.images,
          productName: item.product.productName,
        },
      })),
      totalAmount,
      status,
      payment,
      address,
      createdAt,
      updatedAt,
    };
    return { order: formattedOrder };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const cancelOrder = async (id: number, user: any) => {
  try {
    // @ts-ignore
    const order = await Order.findByPk(id);

    if (!order) {
      return { message: 'Order Not Found' };
    }

    // Get the items from the order
    const { items } = order.dataValues;

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const { product } = item;
        const { productId } = product;
        const quantityOrdered = item.quantity;
        const originalQuantity = product.quantity;
        const updatedQuantity = originalQuantity + quantityOrdered;

        await Product.update({ quantity: updatedQuantity, isAvailable: true }, { where: { productId } });
      }
    }

    await order.destroy();
    return {
      id: order.dataValues.id,
      buyerId: user.id,
      items: [],
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllOrders = async (user: any) => {
  try {
    const orders = await Order.findAll({
      where: {
        userId: user.id,
      },
    });

    if (!orders || orders.length === 0) {
      return { message: 'You have no orders' };
    }

    return {
      buyerOrders: orders.map((order: any) => {
        const { userId, totalAmount, status, payment, address, createdAt, updatedAt } = order.dataValues;

        return {
          orderId: order.dataValues.id,
          buyerId: userId,
          items: order.dataValues.items.map((item: any) => ({
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            product: {
              images: item.product.images,
              productName: item.product.productName,
            },
          })),
          totalAmount,
          status,
          payment,
          address,
          createdAt,
          updatedAt,
        };
      }),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getAllOrdersByAdmin = async () => {
  try {
    const orders = await Order.findAll();

    if (!orders || orders.length === 0) {
      return { message: 'There are no orders yet' };
    }

    return {
      AllOrders: orders.map((order: any) => {
        const { userId, totalAmount, status, payment, createdAt, updatedAt } = order.dataValues;

        return {
          orderId: order.dataValues.id,
          buyerId: userId,
          totalAmount,
          status,
          payment,
          createdAt,
          updatedAt,
        };
      }),
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
