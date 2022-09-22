import {useState} from 'react'
import Ship from './Ship';
import { IShip } from '../types';
import {ShipStore} from '../store/authStore';
import {Button} from '@mui/material'

interface IProps {
  ships: IShip[];
  setShips: React.Dispatch<React.SetStateAction<IShip[]>>;
  setIsGame: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShipsContainer = ({ships, setShips, setIsGame}: IProps) => {
  const { selectedShip } = ShipStore();

  const shipToRender = ships.some(ship => ship.isPlaced === false)

  return (
    <div className='border grid grid-cols-1 xl:grid-cols-2 justify-content-center'>
      {shipToRender ? ships.map((ship, idx) => 
        <Ship 
          key={idx} 
          ship={ship} 
          selected={selectedShip?.id === ship.id}
          ships={ships}
          setShips={setShips}
        />
      ) : (
        <Button
          onClick={() => setIsGame(true)}
        >
          Play
        </Button>
      )}
    </div> 
  )
}

export default ShipsContainer;