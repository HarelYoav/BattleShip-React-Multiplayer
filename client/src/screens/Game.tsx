import { useContext, useState } from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Ship from '../components/Ship';
import { shipsData } from '../utils/shipsData';
import Board from '../components/Board';
import { IShip } from '../types';



const Game = () => {

  const { socket, play_against} = useContext(SocketContext).SocketState;

  const [ships, setShips] = useState<IShip[]>(shipsData);
  const [selectedShip, setSelectedShip] = useState<IShip>();

  console.log(selectedShip)
  return (
    <div
      className='xl:w-[1200px] w-[350px] m-auto overflow-hidden h-[100vh]'
    > 
      <div className='p-5 text-center'>
        <h1>{`${socket?.id} aginst: ${play_against?.socketId}`}</h1>
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-2'>
        <Board/>
        <div className='border grid grid-cols-1 xl:grid-cols-2 justify-content-center'>
          {ships.map((ship, idx) => 
            <Ship 
              key={idx} 
              ship={ship} 
              selected={selectedShip?.id === ship.id} 
              setSelectedShip={setSelectedShip}
              ships={ships}
              setShips={setShips}
            />
          )}
        </div>  
      </div>
    </div>
  )
}

export default Game