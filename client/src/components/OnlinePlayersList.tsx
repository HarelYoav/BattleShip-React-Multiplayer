import React, { useContext } from 'react';
import PlayerCard from './PlayerCard';
import SocketContext  from '../contexts/Socket/SocketContext';


const OnlinePlayersList = () => {

  const { socket, uid, users} = useContext(SocketContext).SocketState;
  const oponents = users.filter(user => user.socketId !== socket?.id);

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
