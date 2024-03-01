import Ship from './Ship';
import { IShip } from '../types';
import { ShipStore } from '../store/authStore';
import { Button, Grid, Container, Typography, Box} from '@mui/material'

interface IProps {
  ships: IShip[] | undefined;
  setShips: React.Dispatch<React.SetStateAction<IShip[] | undefined>>;
  startGame: () => void;
}

const ShipsContainer = ({ships, setShips, startGame}: IProps) => {
  
  const { selectedShip } = ShipStore();
  const shipToRender = ships?.some(ship => ship.isPlaced === false)

  return (
    <Container maxWidth="xl">
      {shipToRender ? (
        <Container maxWidth="xl">
          <Typography textAlign='center' sx={{m: 1, p:1}}>
            Place your ships
          </Typography>
          <Grid container spacing={1} display={'flex'} justifyContent={'center'}>
            {ships?.map((ship, idx) => 
              <Ship 
              key={idx} 
              ship={ship} 
              selected={selectedShip?.id === ship.id}
              ships={ships}
              setShips={setShips}
              />
            )}
          </Grid>
        </Container> 
      ) : (
        <Box marginTop={{md: 15}}>
        <Button
          variant='contained'
          color='inherit'
          fullWidth={true}
          sx={{my: 'auto'}}
          onClick={startGame}
        >
          Start Game
        </Button>
        </Box>
      )}
    </Container> 
  )
}

export default ShipsContainer;


// ships?.map((ship, idx) => 
        