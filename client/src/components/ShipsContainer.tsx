import Ship from './Ship';
import { IShip } from '../types';
import { ShipStore } from '../store/authStore';
import { Button } from '@mui/material'

interface IProps {
  ships: IShip[] | undefined;
  setShips: React.Dispatch<React.SetStateAction<IShip[] | undefined>>;
  startGame: () => void;
}

const ShipsContainer = ({ships, setShips, startGame}: IProps) => {
  
  const { selectedShip } = ShipStore();
  const shipToRender = ships?.some(ship => ship.isPlaced === false)

  return (
    <div className='grid grid-cols-2 justify-content-center'>
      {shipToRender ? ships?.map((ship, idx) => 
        <Ship 
          key={idx} 
          ship={ship} 
          selected={selectedShip?.id === ship.id}
          ships={ships}
          setShips={setShips}
        />
      ) : (
        <Button
          onClick={startGame}
        >
          Play
        </Button>
      )}
    </div> 
  )
}

export default ShipsContainer;