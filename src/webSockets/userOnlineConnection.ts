import { Namespace, Socket } from 'socket.io';
import { createErrorResponse, isPresent } from '../utils/helpers';
import { UnauthorizedError } from '../errors';
import UserRepository from '../repository/UserRepository';

const userOnlineConnectionHandler = (io: Namespace) => {
  const userRepository = new UserRepository();

  io.on('connection', (socket: Socket) => {
    const { token }: any = socket.handshake.auth;
    const { userToSubscribe }: any = socket.handshake.query;
    let userId = null;

    try {
      const dataFromToken = userRepository.verifyToken(token);
      userId = dataFromToken['id'];

      if (isPresent(userId)) {
        console.log(`New User Online websocket connection for ${userToSubscribe} from ${userId}`);

        socket.join(userToSubscribe);
      } else {
        throw UnauthorizedError();
      }
    } catch (error) {
      console.log(`Error for token ${token} ->`, error);

      socket.send(createErrorResponse(error));

      socket.disconnect();
    }
  });
};

export default userOnlineConnectionHandler;
