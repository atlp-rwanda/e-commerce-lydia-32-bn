import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import Product from '../models/productModel.js';
import { OrderAttributes} from '../models/orderModel.js'

interface OrderItemData {
  productId: number;
  quantity: number;
  price: number;
}

interface CreateOrderData {
  userId: number;
  items: OrderItemData[];
}

class OrderService {
  public async createOrder(orderData: CreateOrderData): Promise<Order> {
    const { userId, items } = orderData;

    if (!Order.sequelize) {
      throw new Error('Sequelize instance is not defined on the Order model.');
    }
    // Start a transaction
    const transaction = await Order.sequelize.transaction();

    try {
      const order = await Order.create({ userId, totalAmount: 0, status: 'pending', paymentMethod: 'none' } as Omit<OrderAttributes, 'id'>, { transaction });
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        orderId: order.id,
      }));
      await OrderItem.bulkCreate(orderItems, { transaction });
      await transaction.commit();

      return order;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof Error) {
        throw new Error('Error creating order: ' + error.message);
      } else {
        throw new Error('An unexpected error occurred while creating order');
      }
    }
  }

  public async getOrderById(orderId: number): Promise<Order | null> {
    return Order.findByPk(orderId, {
      include: [
        {
          model: OrderItem,
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
  }

  public async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
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
  }

  public async getAllOrders(): Promise<Order[]> {
    return Order.findAll({
      include: [
        {
          model: OrderItem,
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
  }
}

export default new OrderService();