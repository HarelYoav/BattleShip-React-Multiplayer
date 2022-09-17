import {useContext, useEffect} from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './components/Navbar';
import { OnlinePlayersList } from './components/OnlinePlayersList';
import SocketContextComponent  from './contexts/Socket/SocketContextComponent';
import { v4 } from 'uuid';
import './styles/globals.css';

const App = () => {

  const id = v4();

  return (
    <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
      <NavBar/>
      <div className='mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1'>
        <SocketContextComponent id={id}>
          <Routes>
            <Route path='/' element={ <OnlinePlayersList/> } />
          </Routes>
        </SocketContextComponent >
      </div>
    </div>
  );
}

export default App;
