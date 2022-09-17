import React, { useContext, useEffect, useState } from 'react';
import PlayerCard from './PlayerCard';
import SocketContext  from '../contexts/Socket/SocketContext';


export const OnlinePlayersList = () => {

  const { socket, uid, users} = useContext(SocketContext).SocketState;
  const oponents = users.filter(user => user.socketId !== socket?.id);

  return (
    <div>
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
}
