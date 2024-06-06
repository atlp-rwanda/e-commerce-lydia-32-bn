import express from "express";
import { notificationControllerInstance } from "../controllers/notificationController/notificationController.js"


export const notificationRouter = express.Router();

notificationRouter.put('/notification/updatestatus/:id', notificationControllerInstance.updateReadStatus);