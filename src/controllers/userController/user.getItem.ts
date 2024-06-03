import jwt, {JwtPayload} from 'jsonwebtoken'
import { userService } from '../../services/registeruser.service.js';
import {ProductService, productService} from '../../services/product.service.js'
import {Request, Response} from 'express';



 class buyerRequests {

 async getBuyerProduct(req: Request, res: Response): Promise<void>{
  
   try{
    const productId = parseInt(req.params.productId, 10);

    const productServiceInstance = new ProductService();
    const product = await productServiceInstance.getProductByFields({ productId, isAvailable: true });

    if (!product) {
     res.status(404).json({ message: "Oops!!! There is no match for this product in available products" });
     return;
    } else {
      res.status(200).json({ message: "Product available in store", product });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    return;
  }
  
}

}

export const BuyerRequestInstance = new buyerRequests;
