import * as React from 'react';
import {AppBar,Container, Box, Typography}  from '@mui/material';
import { useGameStore } from '../store/authStore';



const Navbar = () => {

  const { playerName } = useGameStore();


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Box display={'flex'} justifyContent={'center'} py={2}>
          <Typography variant='h6'>Welcome {playerName}</Typography>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar