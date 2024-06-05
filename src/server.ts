import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/db.js';
import swaggerDocs from './utilis/swagger.js';
import { usersRouter } from './routes/user.route.js';
import { productRouter } from './routes/productRoutes.js';
import { sellerRouter } from './routes/sellerRoutes.js';
import { rolesRouter } from './routes/roleRoutes.js';
import { wishListRouter } from './routes/wishListRoutes.js';
import { paymentRouter } from './routes/paymentsRoutes.js';
import PaymentController from './controllers/paymentController/paymentController.js'
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoute.js'


dotenv.config();

db.authenticate()
  .then((res) => console.log('connected to database successfully'))
  .catch((error) => console.log(error));
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

app.use(express.json());
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/', (req, res) => {
  res.send('welcome to our project');
});

paymentRouter.post('/webhook', express.raw({ type: 'application/json' }), PaymentController.handleWebhook.bind(PaymentController));

// Routes for the endpoints
app.use('/api', usersRouter, productRouter, sellerRouter, rolesRouter, wishListRouter, cartRoutes, orderRoutes, paymentRouter);

swaggerDocs(app, port);
app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
