import { Namespace } from 'socket.io';
import http from 'http';
import mainSocketConnectionHandler from './mainSocketConnection';

const startWebsocket = (server: ReturnType<typeof http.createServer>) => {
  const mainSocketConnection: Namespace = require('socket.io')(server);

  mainSocketConnectionHandler(mainSocketConnection);
};

export default startWebsocket;
