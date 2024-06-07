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
import { notificationRouter } from './routes/notificationRoute.js';
import {reviewRouter} from './routes/reviewroute.js'

import { paymentRouter } from './routes/paymentsRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoute.js'
import http from 'http';
import { Server } from 'socket.io';



dotenv.config();

db.authenticate()
  .then((res) => console.log('connected to database successfully'))
  .catch((error) => console.log(error));
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

const server = http.createServer(app);
export const io = new Server(server);
export const socket = new Server(server);



io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

setTimeout(() => {
  console.log('Emitting order status update');
  socket.emit('orderStatusUpdate', {
    orderId: '12345',
    orderStatus: 'Awaiting Payment'
  });
}, 5000);
;

app.use(express.json());
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/', (req, res) => {
  res.send('welcome to our project');
});



// Routes for the endpoints

app.use('/api', cartRoutes, notificationRouter, orderRoutes, productRouter, reviewRouter, rolesRouter, sellerRouter, usersRouter, wishListRouter);
app.use('/api', usersRouter, productRouter, sellerRouter, rolesRouter, wishListRouter, cartRoutes, orderRoutes, paymentRouter);

swaggerDocs(app, port);
app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
