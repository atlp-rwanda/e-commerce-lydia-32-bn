
import { Router } from "express";

import { isLoggedIn } from "../middleware/authMiddleware.js";
import { addToCartController } from "../controllers/cartController/cartControllers.js";


const cartRoutes = Router();


cartRoutes.post("/cart/add",isLoggedIn ,addToCartController);


export default cartRoutes;