import {useCallback, useEffect, useState} from 'react'
import {Grid, Card, Box, CardActionArea, CardContent, Typography} from '@mui/material';
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
    <Grid item xs={6}>
      <Card sx={{display: 'flex', maxWidth: 275 }} className={mainStyle}>
        <CardContent sx={{flex: '1 0 auto'}}>
          <CardActionArea onClick={selectShip}>
            <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }} justifyContent='space-between'>
              <img src="./ship.png" alt="noShip" className={iconStyle}/>
              {/* <Button
                onClick={rotateShip}
              > */}
                <CachedIcon onClick={rotateShip}/>
              {/* </Button> */}
            </Box>
              <Typography variant="h5" component="div">
              {ship.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                Spaces: {ship.spaces}
              </Typography>
          </CardActionArea>
        </CardContent>
      </Card>
    </Grid>          
  )
}

export default Ship