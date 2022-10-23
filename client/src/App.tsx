import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from './components/Navbar';
import Game from './screens/Game';
import OnlinePlayersList from './components/OnlinePlayersList';
import SocketContextComponent  from './contexts/Socket/SocketContextComponent';
import { useGameStore } from "./store/authStore";
import { v4 } from 'uuid';
import { ThemeProvider, createTheme, Box, Button, TextField } from '@mui/material';

import './styles/globals.css';


const theme = createTheme({
  palette: {
    mode: 'light'
  },
});

const App = () => {
  const {uid, playerName, setUid, setPlayerName} = useGameStore();
  const [name, setName] = useState('');
  const [chooseName, setChooseName] = useState(false);

  if(uid === '') {
    setUid(v4());
  }




  const connect = () => {
    if(name.length) {
      setPlayerName(name);
      setChooseName(true);
    }
  }
  

  if(playerName === '') {
    return (
      <Box display={'flex'} justifyContent={'center'} alignSelf={'center'} py={5} gap={'1rem'}>
        <TextField id="outlined-basic" label="Enter your name" variant="outlined" onChange={(e) => setName(e.target.value)}/>
        <Button variant="contained" onClick={connect}>Connect</Button>
      </Box>
      
    )
  }
  
  return (
    
    <ThemeProvider theme={theme}>
      <NavBar/>
      <SocketContextComponent>
        <Routes>
          <Route path='/' element={ <OnlinePlayersList/> } />
          <Route path='/game' element={ <Game/>}/>
        </Routes>
      </SocketContextComponent >
    </ThemeProvider>
      
  );
}

export default App;
