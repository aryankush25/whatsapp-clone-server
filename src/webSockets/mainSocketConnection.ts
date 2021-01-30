import { Namespace, Socket } from 'socket.io';
import {
  createErrorResponse,
  createSuccessResponse,
  createWebSocketUpdatePayload,
  isNilOrEmpty,
  isPresent,
} from '../utils/helpers';
import { messageTypes } from '../utils/constants';
import { UnauthorizedError, ArgumentsDoesNotExistError } from '../errors';
import { UserController } from '../controller/UserController';
import { ChatController } from '../controller/ChatController';
import UserRepository from '../repository/UserRepository';

const mainSocketConnectionHandler = (io: Namespace) => {
  const userRepository = new UserRepository();
  const userController = new UserController();
  const chatController = new ChatController();

  io.on('connection', async (socket: Socket) => {
    const { token }: any = socket.handshake.auth;
    let userId = null;

    try {
      const dataFromToken = userRepository.verifyToken(token);
      userId = dataFromToken['id'];

      if (isPresent(userId)) {
        console.log('New websocket connection', userId);

        socket.join(userId);

        await userController.setUserOnline(userId);

        socket.send(createWebSocketUpdatePayload(messageTypes.connectionUpdate, { userId, status: 'Connected' }));

        // io.of('/userOnline').to(userId).emit('message', { isOnline: true });
      } else {
        throw UnauthorizedError();
      }
    } catch (error) {
      console.log(`Error for token ${token} ->`, error);

      socket.send(createErrorResponse(error));

      socket.disconnect();
    }

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
          if (isNilOrEmpty(message) || isNilOrEmpty(message.text) || isNilOrEmpty(message.to)) {
            throw ArgumentsDoesNotExistError();
          }

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

      io.to('/userOnline').emit(userId, { isOnline: false });

      console.log('Closed websocket connection', userId);
    });
  });
};

export default mainSocketConnectionHandler;
