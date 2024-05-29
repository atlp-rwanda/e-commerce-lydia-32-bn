import { addItemToCart, removeProductFromCart, viewUserCart } from "../controllers/cartController/cartControllers.js";
import { Router } from "express";

import { isLoggedIn } from "../middleware/authMiddleware.js";


const cartRoutes = Router();

cartRoutes.get("/cart",isLoggedIn,viewUserCart);
cartRoutes.post("/cart/add",isLoggedIn,addItemToCart);
// cartRoutes.put("/cart/remove",isLoggedIn,removeProductFromCart);
// cartRoutes.delete("/",isLoggedIn,isPasswordOutOfDate, clearAllProductFromCart);
// cartRoutes.patch("/",isLoggedIn,isPasswordOutOfDate,validateUpdateProductQty, isProductFound, updateProductQuantity);

export default cartRoutes;