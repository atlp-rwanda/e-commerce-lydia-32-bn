import { checkout } from '../controllers/orderController.ts/checkoutController.js';
  import { Router } from 'express';
  
  import { isLoggedIn } from '../middleware/authMiddleware.js';
  
  const orderRoutes = Router();
  orderRoutes.post('/order',isLoggedIn ,checkout);

  export default orderRoutes;