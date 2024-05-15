import express, { Request, Response } from 'express';
import db from './config/db.js';
import User from './models/userModel.js';

import swaggerDocs from './utilis/swagger.js';

db.authenticate()
  .then((res) => console.log('connected to database successfully'))
  .catch((error) => console.log(error));
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('welcome to our project');
});

swaggerDocs(app, port);
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});
