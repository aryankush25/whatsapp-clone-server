import { UserController } from '../controller/UserController';

const userRoutes = [
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
];

export default userRoutes;
