import { Router } from 'express';
import {createMessage, viewAllMessage} from '../controllers/postController/messageController.js'
import { isLoggedIn } from '../middleware/authMiddleware.js';

const postRoutes = Router();

postRoutes.get('/post', isLoggedIn, viewAllMessage);
postRoutes.post('/post/add', isLoggedIn, createMessage);

export default postRoutes