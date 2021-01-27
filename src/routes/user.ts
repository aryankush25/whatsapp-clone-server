import { RoutesPayload } from './';
import { UserController } from '../controller/UserController';

const userRoutes: RoutesPayload[] = [
  {
    method: 'post',
    route: '/register',
    controller: UserController,
    action: 'register',
    openAuth: true,
  },
  {
    method: 'post',
    route: '/login',
    controller: UserController,
    action: 'login',
    openAuth: true,
  },
  {
    method: 'get',
    route: '/me',
    controller: UserController,
    action: 'me',
  },
  {
    method: 'delete',
    route: '/me',
    controller: UserController,
    action: 'deleteMe',
  },
  {
    method: 'get',
    route: '/myInitiatedChatsUsers',
    controller: UserController,
    action: 'getInitiatedChatUsers',
  },
];

export default userRoutes;
