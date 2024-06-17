import { Socket,Server } from "socket.io";
import { Request,Response } from "express";
import { newChatMessages, pastMessages} from "../../services/chatService/chat-service.js";
import {io} from '../../server.js'

export const  sendMessages = async(req: Request, res: Response) =>{
    try {
        const {content}:any = req.body;
     
        const sentMessage:any = await newChatMessages(content);
        if(sentMessage){
            io.emit('chat message',sentMessage);
        };
        return res.status(200).json(sentMessage)
    } catch (error) {
        console.log(error)
        res.status(500).json({err: error})
    }
}

export const  getPastMessages = async(Req: Request, Res: Response) =>{
    try {
        const Messages:any = await pastMessages();
        return Res.status(200).json(Messages)
    } catch (error) {
        console.log(error)
        Res.status(500).json({err: error})
    }
}