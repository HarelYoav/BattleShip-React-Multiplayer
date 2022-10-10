import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { Button } from '@mui/material';
import { useGameStore } from '../store/authStore';
import './endGame.css';

interface IPorps {
  createBoard: () => void;
}

const EndGame = ( { createBoard } : IPorps) => {

  const { clearState } = useGameStore();
  const { socket } = useContext(SocketContext).SocketState;
  const navigate = useNavigate();

  const backToMenu = () => {
    clearState();
    socket?.emit('finish_game');
    navigate('/');
  }

  const newGame = () => {
    createBoard();
  }

  return (
    <div id='glass-effect' className='p-10 items-center text-center'>
      <h1>Game Over</h1>
      <div className='flex justify-evenly p-5'>
        <div className='mr-2'>
          <Button 
            variant='outlined'
            onClick={newGame}
          >
            Play again
          </Button>
        </div>
        <Button 
          variant='outlined'
          onClick={backToMenu}
          >
            Back to Menu
        </Button>
      </div>
    </div>
  )
}

export default EndGame;