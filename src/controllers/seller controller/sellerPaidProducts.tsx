
import { Request, Response } from 'express';
import Order from '../../models/orderModel.js';
import { where } from 'sequelize';

export const sellerStats = async (req: Request, res: Response) =>{

try {
    const id = req.userId
    const orders = await Order.findAll({where:{status:'Paid'}})
    const stats: any = [] 
    orders.map((order: any) => {
     
        return  {
          items: order.dataValues.items.map((item: any) => {
            if(item.product.userId === id){
            stats.push(item)
            }
                
        })
         
        };
      })

    return res.status(200).json({
        stats
      }  ) 

} catch (error) {
    console.log(error);
}
}