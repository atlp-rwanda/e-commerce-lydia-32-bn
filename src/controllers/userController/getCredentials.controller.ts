import { Request, Response } from 'express';


export const getUserCredentials = (req: Request, res: Response) => {
    try {
    //@ts-ignore
    const currentUser  = req.user
    res.status(200).json(currentUser)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}
