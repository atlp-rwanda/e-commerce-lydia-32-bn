import { io } from '../../server.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../users.js';
import formatMessage from '../messages.js';
import Message from '../../models/postModel.js';

const botName = 'E-commerce Bot';

const chatApp = () => {
  io.on('connection', (socket) => {
    socket.on('joinRoom', async () => {
     
      const user = userJoin(socket.id, 'chat');
      socket.join(user.room);

      socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `Someone has joined the chat`));

      const messages: any = await Message.findAll({ where: { room: user.room } });

      messages.forEach((message: any) => {
        socket.emit('message', formatMessage('', message.dataValues.content));
      });
    });

    socket.on('chatMessage', async (message) => {
      const user: any = getCurrentUser(socket.id);

       await Message.create({
        room: user.room,
        content: message
      });
      // @ts-ignore
      io.to(user.room).emit('message', formatMessage("", message));
    });

    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit('message', formatMessage(botName, `Someone has left the chat`));

        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};
export default chatApp;
