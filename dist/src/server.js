"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
db_1.default.authenticate()
    .then((res) => console.log(`connected to database successfully`))
    .catch((error) => console.log(error));
const app = (0, express_1.default)();
const port = 5000;
app.get('/', (req, res) => {
    res.send('welcome to our project');
});
app.listen(port, () => {
    console.log(`app is running on ${port}`);
});
