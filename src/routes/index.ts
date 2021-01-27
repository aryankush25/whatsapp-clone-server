import userRoutes from './user';
import chatRoutes from './chat';
import { UserController } from '../controller/UserController';
import { ChatController } from '../controller/ChatController';

export interface RoutesPayload {
  method: string;
  route: string;
  controller: typeof UserController | typeof ChatController;
  action: string;
  openAuth?: boolean;
}

export const Routes: RoutesPayload[] = [...userRoutes, ...chatRoutes];
