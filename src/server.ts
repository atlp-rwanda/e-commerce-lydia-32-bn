import express from 'express';
//import swaggerjsdoc from 'swagger-jsdoc';
//import swaggerui from 'swagger-ui-express';
import swaggerDocs from './utilis/swagger.js';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('welcome to our project');
});
swaggerDocs(app, 8000)
app.listen(port, () => {
  console.log(`app is running on ${port}`);
});

export default app;

