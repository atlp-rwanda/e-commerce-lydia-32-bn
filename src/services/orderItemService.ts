import OrderItem from '../models/orderItemModel.js';

class OrderItemService {
  async createOrderItem(orderItemData: { orderId: number; productId: number; quantity: number; price: number }) {
    const { orderId, productId, quantity, price } = orderItemData;
    const orderItem = await OrderItem.create({ orderId, productId, quantity, price });
    return orderItem;
  }

  async getOrderItemsByOrderId(orderId: number) {
    const orderItems = await OrderItem.findAll({ where: { orderId } });
    return orderItems;
  }

  async getOrderItemById(orderItemId: number) {
    const orderItem = await OrderItem.findByPk(orderItemId);
    return orderItem;
  }

  async updateOrderItem(orderItemId: number, data: { quantity?: number; price?: number }) {
    const orderItem = await OrderItem.findByPk(orderItemId);
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    const updatedOrderItem = await orderItem.update(data);
    return updatedOrderItem;
  }

  async deleteOrderItem(orderItemId: number) {
    const orderItem = await OrderItem.findByPk(orderItemId);
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    await orderItem.destroy();
  }
}

export default new OrderItemService();