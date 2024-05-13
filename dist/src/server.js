"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import swaggerjsdoc from 'swagger-jsdoc';
//import swaggerui from 'swagger-ui-express';
const swagger_js_1 = __importDefault(require("./utilis/swagger.js"));
const app = (0, express_1.default)();
const port = 5000;
app.get('/', (req, res) => {
    res.send('welcome to our project');
});
(0, swagger_js_1.default)(app, 8000);
app.listen(port, () => {
    console.log(`app is running on ${port}`);
});
