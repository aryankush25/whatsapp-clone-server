import { Namespace } from 'socket.io';
import http from 'http';
import mainSocketConnectionHandler from './mainSocketConnection';
import userOnlineConnectionHandler from './userOnlineConnection';

const startWebsocket = (server: ReturnType<typeof http.createServer>) => {
  const mainSocketNamespace: Namespace = require('socket.io')(server);
  const userOnlineNamespace: Namespace = require('socket.io')(server, {
    path: '/userOnline',
  });

  mainSocketConnectionHandler(mainSocketNamespace, userOnlineNamespace);
  userOnlineConnectionHandler(userOnlineNamespace);
};

export default startWebsocket;
