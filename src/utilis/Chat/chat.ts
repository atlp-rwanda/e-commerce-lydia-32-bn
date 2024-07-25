import { io } from '../../server.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../users.js';
import formatMessage from '../messages.js';
import Message from '../../models/postModel.js';

const botName = 'E-commerce Bot';

const chatApp = async() => {
  
  io.on('connection', (socket) => {
    socket.on('joinRoom', async (username) => {
      let user;
  
      user = userJoin(socket.id, username, 'chat');
      socket.join(user.room);

      socket.emit('message', formatMessage(botName, `${username ? username: 'traveller'} Welcome to Chat!`));

      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${username ? username: 'traveller'} has joined the chat`));

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

      // Send previous messages
      const messages: any = await Message.findAll({ where: { room: user.room } });
      messages.forEach((message: any) => {
        socket.emit('message', formatMessage(message.dataValues.name, message.dataValues.content));
      });
    });

    socket.on('chatMessage', async (message) => {
      const user: any = getCurrentUser(socket.id);
      if (user) {
        await Message.create({
          name: user.username,
          room: user.room,
          content: message,
        });
        io.to(user.room).emit('message', formatMessage(user.username, message));
      }
    });

    socket.on('disconnect', () => {
      const user = userLeave(socket.id);

      if (user) {
        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

        io.to(user.room).emit('roomUsers', {
          room: user.room,
          users: getRoomUsers(user.room),
        });
      }
    });
  });
};

export default chatApp;