import { addItemToCart } from "../controllers/cartController/cartControllers.js";
import { Router } from "express";

import { isLoggedIn } from "../middleware/authMiddleware.js";


const cartRoutes = Router();

// cartRoutes.get("/",isLoggedIn,isPasswordOutOfDate,viewUserCart);
cartRoutes.post("/cart/add",isLoggedIn ,addItemToCart);
// cartRoutes.put("/",isLoggedIn,isPasswordOutOfDate,validateRemoveProductQty, isProductFound,removeProductFromCart);
// cartRoutes.delete("/",isLoggedIn,isPasswordOutOfDate, clearAllProductFromCart);
// cartRoutes.patch("/",isLoggedIn,isPasswordOutOfDate,validateUpdateProductQty, isProductFound, updateProductQuantity);

export default cartRoutes;