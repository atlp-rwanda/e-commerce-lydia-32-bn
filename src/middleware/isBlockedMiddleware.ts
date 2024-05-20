import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js'

 export const isBlocked = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email }  = req.body
        const user = await User.findOne({ where: { email}})

        if(user) {
            if(user.dataValues.isBlocked === true) {
           return   res.status(200).json({message: "Your account is blocked, check your email to see the reason why"})
            }
          return next()
        }
    } catch (error) {
       return res.status(500).json(error)
        console.log(error)
    }
}

