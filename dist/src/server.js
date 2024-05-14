import express from "express";
import db from "./config/db.js";
db.authenticate()
    .then((res) => console.log(`connected to database successfully`))
    .catch((error) => console.log(error));
import swaggerDocs from './utilis/swagger.js';
const app = express();
const port = 5000;
app.get('/', (req, res) => {
    res.send('welcome to our project');
});
swaggerDocs(app, 8000);
app.listen(port, () => {
    console.log(`app is running on ${port}`);
});
export default app;
