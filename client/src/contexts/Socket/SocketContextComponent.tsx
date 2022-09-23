import { PropsWithChildren, useEffect, useReducer, useState, useContext } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from './SocketContext';
import { IUser } from '../../types';
import { useNavigate } from "react-router-dom";


interface IProps extends PropsWithChildren{
  id: string;
}

const SocketContext = (props : IProps) => {
  
  const { children } = props;
  const navigate = useNavigate();
  const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
  const [loading, setLoading] = useState(true);
  const socket = useSocket('ws://localhost:8080', {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false
  });

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
    //Listen on coming invitation
    socket.on('invite_play', (socketId) => {
      SocketDispatch({ type: 'add_invited', payload: socketId});
    });
    // listen on cancel coming invitation
    socket.on('cancel_invite_play', socketId => {
      SocketDispatch({ type: 'remove_invited', payload: socketId});
    });
    //when 2 players start game, a in_game events will be sent to all the other players
    // to notify them which players are currently in a game
    socket.on('in_game', (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users});
    });
    //listen to confirmation to play from other players, who the current user ivited them
    //This event will start the game between 2 players
    socket.on('confim_play', (user: IUser) => {
      SocketDispatch({ type: 'update_play_against', payload: user});
      navigate('/game');
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

  if(loading) return <p>Loading Socket IO...</p>
  
  return (
    <SocketContextProvider value={{SocketState, SocketDispatch}}>
      {children}
    </SocketContextProvider>
  )
}

export default SocketContext;