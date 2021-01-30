import { Namespace, Socket } from 'socket.io';
import { UserController } from '../controller/UserController';
import { ChatController } from '../controller/ChatController';
import UserRepository from '../repository/UserRepository';

interface ResponseProps {
  isSuccess: boolean;
  data?: Object;
  error?: Object;
}

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
      type: 'CONNECTION_UPDATE',
      data: { userId, text: 'Connected' },
    });

    socket.on(
      'message',
      async (
        message: {
          text: string;
          to: string;
        },
        callback: Function,
      ) => {
        let response: ResponseProps = {
          isSuccess: false,
        };

        try {
          console.log('Message', { ...message, userId });

          const data = await chatController.createMessage(message.text, userId, message.to);

          io.to(message.to).emit('message', { type: 'MESSAGE', data });

          response.isSuccess = true;
          response.data = data;
        } catch (error) {
          response.error = error;
        } finally {
          callback(response);
        }
      },
    );

    socket.on('disconnect', async () => {
      await userController.setUserOffline(userId);

      console.log('Closed websocket connection', userId);
    });
  });
};

export default startWebsocket;
