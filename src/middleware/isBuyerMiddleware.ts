import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js'
import {UserService} from '../services/registeruser.service.js'

 export const isBuyer = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.body.userId;
        const user = await UserService.getUserById(userId);

        if(user) {
            const roleName = await User.getRoleName(userId);
            console.log('User role name',roleName);
            if(roleName==='buyer'){
              req.body.userId=userId;
              return next()
           }
           else{
            return res.status(400).json({Error: "Only Users are allowed to access this route"});
           }
       }
     } catch (error) {
          return res.status(500).json(error)
        console.log(error)
    }
}

