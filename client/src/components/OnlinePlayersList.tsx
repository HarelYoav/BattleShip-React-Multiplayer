import { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PlayerCard from './PlayerCard';
import SocketContext  from '../contexts/Socket/SocketContext';
import { IUser } from '../types';
import { useGameStore } from '../store/authStore';


const OnlinePlayersList = () => {

  const navigate = useNavigate();
  const { setOpponent, clearState, opponent } = useGameStore();
  const { SocketDispatch } = useContext(SocketContext);
  const { socket, uid, users} = useContext(SocketContext).SocketState;
  const oponents = users.filter(user => user.socketId !== socket?.id);

  useEffect(() => {
    //update users when new user connect
    socket?.on('user_connected', (users: IUser[]) => {
      console.log("work" + users);
      SocketDispatch({ type: 'update_users', payload: users});
    });
    //update users when user disconnect
    socket?.on('user_disconnected', (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users});
    });
    //Listen on coming invitation
    socket?.on('invite_play', (socketId) => {
      SocketDispatch({ type: 'add_invited', payload: socketId});
    });
    // listen on cancel coming invitation
    socket?.on('cancel_invite_play', socketId => {
      SocketDispatch({ type: 'remove_invited', payload: socketId});
    });
    //when 2 players start game, a in_game events will be sent to all the other players
    // to notify them which players are currently in a game
    socket?.on('in_game', (users: IUser[]) => {
      SocketDispatch({ type: 'update_users', payload: users});
    });
    //The current user invied opponents to play
    //if any opponent confim to play against the current player, it will trigger "confim_play" event
    //This event will start the game between 2 players
    socket?.on('confirm_play', (uid: string) => {
      setOpponent(uid);
      navigate('/game');
    });
  }, [SocketDispatch, navigate, setOpponent, socket]);
  
  useEffect(() => {

    const updatedUsers = users.map(user => {
      if(user.id === opponent?.uid || user.id === uid) {
        user.inGame = false;
      }
      return user;
    });
    // SocketDispatch({ type: 'remove_invited', payload: users.filter(user => user.id === uid)[0].socketId});
    SocketDispatch({type: 'update_users', payload: updatedUsers});
    clearState();
  }, [])

  return (
    <div>
      <h1>{socket?.id}</h1>
      {oponents.map(user => 
        <PlayerCard 
          key={user.socketId} 
          user={user} 
          uid={uid} 
          socket={socket}
        />
      )}
    </div>
  )
};

export default OnlinePlayersList;
