import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

 const isAdmin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt
        if(!token) {
          return  res.status(403).json({message: "No token found"})
        }
        const decodedToken = jwt.verify(token,process.env.VERIFICATION_JWT_SECRET || '')
        const user = await User.findByPk((decodedToken as any).userId)
        if(user && user.dataValues.isAdmin) {
            next()
        }else {
            res.status(401).json({message: "Only Admin can access this route"})
        }
    } catch (error) {
       return res.status(500).json(error)
    }
}

export default isAdmin
