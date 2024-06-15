import { io } from '../../server.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers } from '../users.js';
import formatMessage from '../messages.js';
import Message from '../../models/postModel.js';
import User from '../../models/userModel.js';

const botName = 'E-commerce Bot';

const chatApp = () => {
  io.on('connection', (socket) => {
    socket.on('joinRoom', async ({ email, room }) => {
      const loginUser = await User.findOne({ where: { email } });

      if (!loginUser || !loginUser.dataValues.email) {
        console.error('User or email not found');
        return;
      }

      const userName = loginUser.dataValues.firstname;
      const user = userJoin(socket.id, userName, room);
      socket.join(user.room);

      socket.emit('message', formatMessage(botName, 'Welcome to Chat!'));

      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      const messages: any = await Message.findAll({ where: { room: user.room } });

      messages.forEach((message: any) => {
        socket.emit('message', formatMessage(message.dataValues.name, message.dataValues.content));
      });
    });

    socket.on('chatMessage', async (message) => {
      const user: any = getCurrentUser(socket.id);
      const loginUser = await User.findOne({ where: { email: message.email } });

      const newMessage = await Message.create({
        name: loginUser?.dataValues.firstname || '',
        room: user.room,
        // @ts-ignore
        userId: loginUser?.dataValues.id,
        content: message.msg,
      });
      // @ts-ignore
      io.to(user.room).emit('message', formatMessage(loginUser?.dataValues.firstname, message.msg));
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
