import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './SocketContext';
import { IUser } from '../../types';
import { useGameStore } from '../../store/authStore';


interface IProps extends PropsWithChildren{
}

const SocketContext = (props : IProps) => {
  
  const { children } = props;
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const [loading, setLoading] = useState(true);
  const socket = useSocket('ws://ec2-54-157-85-245.compute-1.amazonaws.com:5000', {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false
  });
  const { uid, playerName } = useGameStore();

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
  };

  const SendHandShake = (id: string) => {
    console.info('Send HandShake to the server');

    socket.emit('handshake', id, playerName, (uid: string, users: IUser[]) => {
      console.info('User handshake callback');
      SocketDispatch({ type: 'update_uid', payload: uid});
      SocketDispatch({ type: 'update_users', payload: users});

      setLoading(false);
    });
  };

  useEffect(() => {
    //Connect to the Web socket
    socket.connect();

    //Save socket in conntext
    SocketDispatch({ type: 'update_socket', payload: socket });

    //start listeners
    StartListenres();

    //send the handshake
    SendHandShake(uid);

  }, []);

  if(loading) return <p>Loading Socket IO...</p>
  
  return (
    <SocketContextProvider value={{SocketState, SocketDispatch}}>
      {children}
    </SocketContextProvider>
  )
}

export default SocketContext;