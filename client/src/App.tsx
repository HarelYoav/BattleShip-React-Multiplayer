import { Routes, Route } from "react-router-dom";
import NavBar from './components/Navbar';
import Board from './screens/Game';
import OnlinePlayersList from './components/OnlinePlayersList';
import SocketContextComponent  from './contexts/Socket/SocketContextComponent';
import { v4 } from 'uuid';
import './styles/globals.css';

const App = () => {

  const id = v4();

  return (
    
    <div>
      <NavBar/>
      <div className='bg-gradient-to-r from-cyan-200 to-cyan-400'>
        <SocketContextComponent id={id}>
          <Routes>
            <Route path='/' element={ <OnlinePlayersList/> } />
            <Route path='/game' element={ <Board/>}/>
          </Routes>
        </SocketContextComponent >
      </div>
    </div>
      
  );
}

export default App;
