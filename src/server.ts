import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import db from './config/db.js';
import swaggerDocs from './utilis/swagger.js';
import User from './models/userModel.js';
import { usersRouter } from './routes/user.route.js';

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

// Routes for the endpoints
app.use('/api', usersRouter);

swaggerDocs(app, port);
app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
