import {useCallback, useEffect, useState} from 'react'
import {Card, CardActionArea, CardContent, Typography, Button} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { IShip } from '../types';
import {ShipStore} from '../store/authStore';



interface IProps {
  ship: IShip
  selected: boolean;
  setShips: React.Dispatch<React.SetStateAction<IShip[] | undefined>>;
  ships: IShip[] | undefined;
}

const Ship = ({ship, selected, ships, setShips}: IProps) => {

  const [rotate, setRotate] = useState(false);
  const { setSelectedShip } = ShipStore();

  const mainStyle = selected ? 'border-2 border-indigo-600 m-auto' : 'm-auto' 
  const iconStyle = rotate ? 'w-10 h-10 rotate-90' : 'w-10 h-10';

  const rotateShip = () => {
    if(!ships) return;
    setRotate(current => !current)
    const updatedShips = [...ships]
    updatedShips[ship.id].rotate = rotate;
    setShips(updatedShips);
    selectShip();
  }

  const selectShip = useCallback(() => {
    ship.rotate = rotate;
    setSelectedShip(ship)
  }, [rotate, setSelectedShip, ship])

  useEffect(() => {
    if(selected) {
      selectShip();
    }
  }, [rotate, selectShip, selected])

  
  if (ship.isPlaced) return null;

  return (
    <div>
      <Card sx={{ maxWidth: 275 }} className={mainStyle}>
        <CardContent>
        <div className='flex justify-between'>
          <CardActionArea onClick={selectShip}>
              <img src="./ship.png" alt="noShip" className={iconStyle}/>
              <Typography variant="h5" component="div">
              {ship.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Spaces: {ship.spaces}
              </Typography>
          </CardActionArea>
          <Button
            onClick={rotateShip}
          >
            <CachedIcon/>
          </Button>
        </div>
          
        </CardContent>
      </Card>
    </div>
  )
}

export default Ship