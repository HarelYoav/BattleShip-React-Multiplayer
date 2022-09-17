import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './SocketContext';
import { IUser } from '../../types';

interface IProps extends PropsWithChildren{
  id: string;
}

const SocketContext = (props : IProps) => {

  const { children } = props;

  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const [loading, setLoading] = useState(true);
  const socket = useSocket('ws://localhost:8080', {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false
  });

  useEffect(() => {
    //Connect to the Web socket
    socket.connect();

    //Save socket in conntext
    SocketDispatch({ type: 'update_socket', payload: socket });

    //start listeners
    StartListenres();

    //send the handshake
    SendHandShake(props.id);

  }, []);

  const StartListenres = () => {
    //reconnect event
    socket.io.on('reconnect', (attempt) => {
      console.info(`Reconnected on attempt: ${attempt}`);
    });

    //reconnect attempt event
    socket.io.on('reconnect_attempt', (attempt) => {
      console.info(`Reconnection attempt: ${attempt}`);
    });

    //reconnect error
    socket.io.on('reconnect_error', (error) => {
      console.info(`Reconnection error: ${error}`);
    });

    //reconnect faild
    socket.io.on('reconnect_failed', () => {
      alert('Failed connet to WebSocket');
    });

    //update users when new user connect
    socket.on('user_connected', (users: IUser[]) => {
      console.log("work" + users);
      SocketDispatch({ type: 'update_users', payload: users});
    });

    //update users when user disconnect
    socket.on('user_disconnected', (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users});
    });

    socket.on('invite_play', (socketId) => {
      SocketDispatch({ type: 'add_invited', payload: socketId});
    });

    socket.on('cancel_invite_play', socketId => {
      SocketDispatch({ type: 'remove_invited', payload: socketId});
    });

    socket.on('in_game', (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users});
    });

  };

  const SendHandShake = (id: string) => {
    console.info('Send HandShake to the server');

    socket.emit('handshake', id, (uid: string, users: IUser[]) => {
      console.info('User handshake callback');
      SocketDispatch({ type: 'update_uid', payload: uid});
      SocketDispatch({ type: 'update_users', payload: users});

      setLoading(false);
    });
  };

  if(loading) return <p>Loading Socket IO...</p>
  
  return (
    <SocketContextProvider value={{SocketState, SocketDispatch}}>
      {children}
    </SocketContextProvider>
  )
}

export default SocketContext;