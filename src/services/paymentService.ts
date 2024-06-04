// services/paymentService.ts
import Payment from '../models/paymentModel.js';
import { PaymentCreationAttributes } from '../models/paymentModel.js';

class PaymentService {
  static async createPayment(data: PaymentCreationAttributes) {
    try {
      const payment = await Payment.create(data);
      return payment;
    } catch (error) {
      throw new Error('Error creating payment: ' + error.message);
    }
  }

  static async getPaymentById(id: number) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }
      return payment;
    } catch (error) {
      throw new Error('Error fetching payment: ' + error.message);
    }
  }

  static async updatePayment(id: number, data: Partial<PaymentCreationAttributes>) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }
      await payment.update(data);
      return payment;
    } catch (error) {
      throw new Error('Error updating payment: ' + error.message);
    }
  }

  static async deletePayment(id: number) {
    try {
      const payment = await Payment.findByPk(id);
      if (!payment) {
        throw new Error('Payment not found');
      }
      await payment.destroy();
      return payment;
    } catch (error) {
      throw new Error('Error deleting payment: ' + error.message);
    }
  }

  static async listPayments() {
    try {
      const payments = await Payment.findAll();
      return payments;
    } catch (error) {
      throw new Error('Error listing payments: ' + error.message);
    }
  }
}

export default PaymentService;
