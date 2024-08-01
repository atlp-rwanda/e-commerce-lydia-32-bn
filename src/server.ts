import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import db from './config/db.js';
import swaggerDocs from './utilis/swagger.js';
import { usersRouter } from './routes/user.route.js';
import { productRouter } from './routes/productRoutes.js';
import { sellerRouter } from './routes/sellerRoutes.js';
import { rolesRouter } from './routes/roleRoutes.js';
import { wishListRouter } from './routes/wishListRoutes.js';
import { notificationRouter } from './routes/notificationRoute.js';
import { reviewRouter } from './routes/reviewroute.js';
import { paymentRouter } from './routes/paymentsRoutes.js';
import chatRouter from './routes/postRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoute.js';
import './cronjobs/expiredProductsCron.js';
import { startCronJob } from '../src/Jobs/passwordExpirationJob.js';
import chatApp from './utilis/Chat/chat.js';
import './handles/notifications.service.js';


dotenv.config();

db.authenticate()
  .then((res) => console.log('connected to database successfully'))
  .catch((error) => console.log(error));

const app = express();

app.use(
  cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(cookieParser());
app.use(express.json());

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.get('/', (req, res) => {
  res.send('welcome to our project');
});

startCronJob();
app.use(
  '/api',
  cartRoutes,
  notificationRouter,
  orderRoutes,
  productRouter,
  reviewRouter,
  rolesRouter,
  sellerRouter,
  usersRouter,
  wishListRouter,
  paymentRouter,
  chatRouter,
);



const server = http.createServer(app);
export const io = new SocketIOServer(server, {
  cors: {
    origin: ['*', 'http://localhost:5173', 'https://e-commerce-lydia-32-fn-staging.onrender.com'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

chatApp();

swaggerDocs(app, port);

server.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});