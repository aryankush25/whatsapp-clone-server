import { Namespace } from 'socket.io';

const startWebsocket = (io: Namespace) => {
  io.on('connection', function (socket: any) {
    console.log('New websocket connection');

    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('message', function (message: any) {
      io.emit('message', message);
    });

    socket.on('disconnect', () => {
      io.emit('message', 'A user has left!');
    });
  });
};

export default startWebsocket;
