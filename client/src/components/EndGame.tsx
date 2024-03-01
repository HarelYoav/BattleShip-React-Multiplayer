import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import { Button } from '@mui/material';
import { useGameStore } from '../store/authStore';
import './endGame.css';

interface IPorps {
  createGameBoard: () => void;
  createOpponentBoard: () => void;
  setIsGame: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setShipsDestroyed: React.Dispatch<React.SetStateAction<number>>;
  win: boolean;
}

const EndGame = ( { createGameBoard, createOpponentBoard, setIsGame, setGameOver, setShipsDestroyed, win } : IPorps) => {

  const { clearState, setOpponentReady } = useGameStore();
  const { socket } = useContext(SocketContext).SocketState;
  const navigate = useNavigate();

  const backToMenu = () => {
    clearState();
    socket?.emit('finish_game');
    navigate('/');
  }

  const newGame = () => {
    setShipsDestroyed(0);
    setGameOver(false);
    setIsGame(false);
    setOpponentReady(false);
    createGameBoard();
    createOpponentBoard();
  }

  return (
    <div id='glass-effect' className='p-10 items-center text-center'>
      <h1>{win ? 'You Win!' : 'You Lose'}</h1>
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