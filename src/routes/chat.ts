import { RoutesPayload } from './';
import { ChatController } from '../controller/ChatController';

const chatRoutes: RoutesPayload[] = [
  {
    method: 'get',
    route: '/myChatsBetween',
    controller: ChatController,
    action: 'getChatsBetween',
  },
];

export default chatRoutes;
