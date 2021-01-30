import { Namespace, Socket } from 'socket.io';
import { UserController } from '../controller/UserController';
import { ChatController } from '../controller/ChatController';
import UserRepository from '../repository/UserRepository';
import { createErrorResponse, createSuccessResponse, createWebSocketUpdatePayload } from '../utils/helpers';
import { messageTypes } from '../utils/constants';

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

    io.to(userId).emit(
      'message',
      createWebSocketUpdatePayload(messageTypes.connectionUpdate, { userId, text: 'Connected' }),
    );

    socket.on(
      'message',
      async (
        message: {
          text: string;
          to: string;
        },
        callback: Function,
      ) => {
        try {
          const data = await chatController.createMessage(message.text, userId, message.to);

          io.to(message.to).emit('message', createWebSocketUpdatePayload(messageTypes.message, data));
          callback(createSuccessResponse(data));
        } catch (error) {
          callback(createErrorResponse(error));
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
