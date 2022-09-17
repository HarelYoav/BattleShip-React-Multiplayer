import {useState} from 'react'
import {Card, CardActionArea, CardContent, Typography, Button} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { IShip } from '../types';

interface IProps {
  ship: IShip
  setSelectedShip: React.Dispatch<React.SetStateAction<IShip | undefined>>;
  selected: boolean;
  setShips: React.Dispatch<React.SetStateAction<IShip[]>>;
  ships: IShip[];
}

const Ship = ({ship, selected, setSelectedShip, ships}: IProps) => {

  const [rotate, setRotate] = useState(false);
  const mainStyle = selected ? 'border-2 border-indigo-600 m-auto' : 'm-auto' 
  const iconStyle = rotate ? 'w-10 h-10 rotate-90' : 'w-10 h-10';

  console.log(selected)

  const rotateShip = async () => {
    await setRotate(current => !current)
    const updatedShips = [...ships]
    updatedShips[ship.id].rotate = rotate;
  }

  const selectShip = () => {
    ship.rotate = rotate;
    setSelectedShip(ship)
  }

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