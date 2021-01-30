import { Namespace } from 'socket.io';
import http from 'http';
import mainSocketConnectionHandler from './mainSocketConnection';
import userOnlineConnectionHandler from './userOnlineConnection';

const startWebsocket = (server: ReturnType<typeof http.createServer>) => {
  const mainSocketConnection: Namespace = require('socket.io')(server);
  const userOnlineConnection: Namespace = require('socket.io')(server, {
    path: '/userOnline',
  });

  mainSocketConnectionHandler(mainSocketConnection);
  userOnlineConnectionHandler(userOnlineConnection);
};

export default startWebsocket;
