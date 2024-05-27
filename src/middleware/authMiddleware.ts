import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";

export const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined = undefined;
    try{
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "You are not logged in. Please login to continue.",
            });
        }
        
        const decoded: any = await jwt.verify(token as string ,process.env.VERIFICATION_JWT_SECRET as string)
        const loggedUser: any = await User.findOne({where:{
            id:decoded.userId
        }})
        if (!loggedUser) {
            return res.status(401).json({
                status: "Unauthorized",
                message: "Please login to continue",
            });
        }
        // @ts-ignore
        req.user = loggedUser;
        next();
    } catch (error: any) {
        return res.status(401).json({
            status: "failed",
            error: error.message + " Token has expired. Please login again.",
        });
    }
}