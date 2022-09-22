import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';

interface IUser {
  id: string;
  socketId: string;
  inGame: boolean;
}

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  //handle all connected users
  public users: {[uid: string]: IUser};

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*'
      }
    });

    this.io.on('connect', this.startListerners);
    console.info('Socket IO started')
  }


  startListerners = (socket: Socket) => {
    console.info(`Message recvied from ${socket.id}`);

    socket.on('handshake', (id: string, callback: (uid: string, users: IUser[]) => void) => {
      console.info(`Handshake recived from ${socket.id}`);

      // check if reconnection
      const recconected = Object.values(this.users).some(user => user.socketId ===  socket.id);
      
      if (recconected) {
        console.info('This user is reconnected');
        const uid = this.GetUidFromSocketId(socket.id);
        const users = Object.values(this.users);

        if (uid) {
          console.info('sending callback for reconnect');
          callback(uid, users);
          return;
        }
      }

      // Create new user
      this.users[id] = {id: id, socketId: socket.id, inGame: false};
      const users = Object.values(this.users);

      console.info('Sending callback for handshake');
      callback(id, users);

      socket.broadcast.emit('user_connected', users)
      
    });

    socket.on('invite_play', (socketId: string) => {
      this.io.to(socketId).emit('invite_play', socket.id);
    });

    socket.on('cancel_invite_play', (socketId: string) => {
      this.io.to(socketId).emit('cancel_invite_play', socket.id);
    });

    socket.on('confirm_play', (uid: string, socketId: string, callback:(users: IUser[]) => void) => {
      this.users[uid].inGame = true;
      const oponentUid = this.GetUidFromSocketId(socketId);
      if(oponentUid) {
        this.users[oponentUid].inGame = true;
        this.io.to(socketId).emit('confim_play', this.users[uid]);
      }
      
      const users = Object.values(this.users);
      socket.broadcast.emit('in_game', users);

      callback(users);

    });

    socket.on('shoot', (oponentSocketId: string, coordinates: {row: number, col: number}) => {
      const oponentUid = this.GetUidFromSocketId(oponentSocketId);
      if(oponentUid) {
        this.io.to(oponentSocketId).emit('shoot', coordinates);
      }

    });

    
    socket.on('disconnect', () => {
      console.info(`disconnected ${socket.id}`);
      const uid = this.GetUidFromSocketId(socket.id);
      if(uid) {
        delete this.users[uid];
        const users = Object.values(this.users);
        socket.broadcast.emit('user_disconnected', users)
      }
    })
  };

  GetUidFromSocketId = (id: string) =>  {
    return Object.keys(this.users).find(uid => this.users[uid].socketId === id);
  };

  /**
   * send mesage rom the socket
   * @param name The name of the event
   * @param users List of users
   * @param payload any information needed to be sent for state update
   */
  SendMesssage = (name: string, users: IUser[], payload?: Object) => {
    console.info(`Emmiting event ${name} to ${users}`);

    for(let i in users) {
      payload ? this.io.to(i).emit(name, payload) : this.io.to(i).emit(name)
      
    }
    // users.forEach(id => payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name));
  }
}