import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
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

import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoute.js'
import http from 'http';
import { Server } from 'socket.io';



dotenv.config();

db.authenticate()
  .then((res) => console.log('connected to database successfully'))
  .catch((error) => console.log(error));
const app = express();

app.use(cors({
  origin: ['*', 'https://team-lydia-demo.onrender.com', 'https://e-commerce-lydia-32-bn.onrender.com', 'https://05cd-154-68-94-10.ngrok-free.app'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

swaggerDocs(app, port);
app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
