import { Namespace } from 'socket.io';
import { UserController } from '../controller/UserController';
import { ChatController } from '../controller/ChatController';

const startWebsocket = (io: Namespace) => {
  const userController = new UserController();
  const chatController = new ChatController();

  io.on('connection', function (socket: any) {
    socket.on('userOnline', async ({ userId }) => {
      console.log('New websocket connection', socket.id);

      socket.join(userId);

      await userController.setUserOnline(userId, socket.id);

      io.to(userId).emit('message', {
        text: 'Connected',
        userId,
      });
    });

    socket.on('message', async (message: any) => {
      console.log('Message', message);

      const chat = await chatController.createMessage(message.text, socket.id, message.to);

      io.to(message.to).emit('message', { chat });
    });

    socket.on('disconnect', async () => {
      await userController.setUserOffline(socket.id);

      console.log('Closed websocket connection', socket.id);
    });
  });
};

export default startWebsocket;
