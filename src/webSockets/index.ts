import { Namespace, Socket } from 'socket.io';
import { UserController } from '../controller/UserController';
import { ChatController } from '../controller/ChatController';
import UserRepository from '../repository/UserRepository';

const startWebsocket = (io: Namespace) => {
  const userRepository = new UserRepository();
  const userController = new UserController();
  const chatController = new ChatController();

  io.on('connection', async (socket: Socket) => {
    const { token }: any = socket.handshake.auth;

    const dataFromToken = userRepository.verifyToken(token);
    const userId = dataFromToken['id'];

    console.log('New websocket connection', userId);

    socket.join(userId);

    await userController.setUserOnline(userId);

    io.to(userId).emit('message', {
      text: 'Connected',
      userId,
    });

    socket.on('message', async (message: any) => {
      console.log('Message', message);
      console.log('User Id', userId);

      const response = await chatController.createMessage(message.text, userId, message.to);

      io.to(message.to).emit('message', { response });
    });

    socket.on('disconnect', async () => {
      await userController.setUserOffline(userId);

      console.log('Closed websocket connection', userId);
    });
  });
};

export default startWebsocket;
