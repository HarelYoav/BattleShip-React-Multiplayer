import { Routes, Route } from "react-router-dom";
import NavBar from './components/Navbar';
import Game from './screens/Game';
import OnlinePlayersList from './components/OnlinePlayersList';
import SocketContextComponent  from './contexts/Socket/SocketContextComponent';
import { useGameStore } from "./store/authStore";
import { v4 } from 'uuid';
import { Container, ThemeProvider, createTheme } from '@mui/material';
import './styles/globals.css';


const theme = createTheme({
  palette: {
    mode: 'dark'
  },
});

const App = () => {
  const {uid, setUid} = useGameStore();
  console.log(uid)
  if(uid === '') {
    setUid(v4());
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
