import { useContext, useState, useEffect, useCallback } from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Board from '../components/Board';
import { IShip, ICell, IOpponentCell } from '../types';
import { ShipStore } from '../store/authStore';
import ShipsContainer from '../components/ShipsContainer';
import OpponentBoard from '../components/OpponentBoard';
import { shipsData } from '../utils/shipsData';
import { useGameStore } from '../store/authStore';



const Game = () => {

  const boardSize = 10;
  const { uid, socket } = useContext(SocketContext).SocketState;
  const { opponent, setReady, yourTurn, setTurn } = useGameStore();
  const { selectedShip, setSelectedShip } = ShipStore();
  const [board, setBoard] = useState<ICell[][]>();
  const [ships, setShips] = useState<IShip[]>(shipsData);
  const [isGame, setIsGame] = useState(false);
  const [shipsDestroyed, setShipsDestroyed] = useState(0);

  const createBoard = useCallback(() => {
    console.log('create')
    const newBoard = new Array(10);

    for(let row = 0; row < boardSize; row++) {
      newBoard[row] = new Array(boardSize)
      for(let col = 0; col < boardSize; col++) {
        const cell: ICell = {
          coordinates: {
            row: row,
            col: col
          },
          isSelected: false,
          isShip: false,
          shipId: -1,
          shootOn: false
        };
        newBoard[row][col] = cell;
      }
    }
    setBoard(newBoard);
    
  }, [setBoard]);

  //This function is called when click on board cell
  const cellClicked = (cell: ICell | IOpponentCell) => {
    //if selected ship invoke placeShip function
    const tmpCell = cell as ICell;
    if(selectedShip) placeShip(cell.coordinates);
    else if(tmpCell.isShip) removeShipFromBoard(tmpCell.shipId);
  }

  const removeShipFromBoard = (shipId: number) => {

    if(!board || !ships) return;

    const updatedShips = [...ships];
    const updatedBoard = [...board];
   
    const ship = updatedShips[shipId];
    if(ship.rotate) {
      for(let i = ship.coordinates.row; i < (ship.spaces + ship.coordinates.row); i++) {
        updatedBoard[i][ship.coordinates.col].isShip = false;
        updatedBoard[i][ship.coordinates.col].shipId = -1;
      }
    } else {
      for(let i = ship.coordinates.col; i < (ship.spaces + ship.coordinates.col); i++) {
        updatedBoard[ship.coordinates.row][i].isShip = false;
        updatedBoard[ship.coordinates.row][i].shipId = -1;
      }
    }
    
    updatedShips[shipId].isPlaced = false;
    setShips(updatedShips);
    setBoard(updatedBoard);
  }

  //This function place ship on the board
  const placeShip = (coordinates: {row: number, col: number}) => {
    //exit the function if no selected ship to place
    if(!board || !selectedShip) return;
    //board to update
    const updatedBoard = [...board];
    if(selectedShip.rotate) { //Place ship vertically
      //if the location is not fit to the ship size
      if (!(((selectedShip.spaces + coordinates.row) - 1) < 10)) return;//replace 10 to boardSize
      //check if all the cells are empty and return if one of the cell has ship on it
      for(let i = coordinates.row; i < (selectedShip.spaces + coordinates.row); i++) {
        if(updatedBoard[i][coordinates.col].isShip) return;
      }
      //place the ship on the board
      for(let i = coordinates.row; i < (selectedShip.spaces + coordinates.row); i++) {
        updatedBoard[i][coordinates.col].isShip = true;
        updatedBoard[i][coordinates.col].shipId = selectedShip.id;
      }
        
    } else { //Place ship horizontal
      //if the location is fit to the ship size
      if (!(((selectedShip.spaces + coordinates.col) - 1) < 10)) return;//replace 10 to boardSize
      //check if all the cells are empty and return if one of the cell has ship on it
      for(let i = coordinates.col; i < (selectedShip.spaces + coordinates.col); i++) {
        if(updatedBoard[coordinates.row][i].isShip) return;
      }
      //place the ship on the board
      for(let i = coordinates.col; i < (selectedShip.spaces + coordinates.col); i++) {
        updatedBoard[coordinates.row][i].isShip = true;
        updatedBoard[coordinates.row][i].shipId = selectedShip.id;
      }
    }
    //set the updated board with the new ship
    setBoard(updatedBoard);
    selectedShip.isPlaced = true;
    selectedShip.coordinates = coordinates;
    const updatedShips = ships.map(ship => {
      if (ship.id !== selectedShip.id) return ship
      else {
        ship.isPlaced = true;
        ship.coordinates = coordinates;
        return ship;
      }
      
    });
    setShips(updatedShips);
    setSelectedShip(null);
  }



  const updateBoard = useCallback((coordinates: {row: number, col: number}) => {
    if(!board || board[coordinates.row][coordinates.col].shootOn) return;
    setBoard((board) => {
      if (board) {
        const updatedBoard = [...board];
        updatedBoard[coordinates.row][coordinates.col].shootOn = true;
        return updatedBoard;
      }
    });
    const isHit = board[coordinates.row][coordinates.col].isShip;
    socket?.emit('opponent_shoot_feedback', coordinates, isHit);
    setTurn(true);
    if(isHit) {
      const updatedShips = [...ships];
      updatedShips[board[coordinates.row][coordinates.col].shipId].hits++;
      setShips(updatedShips);
      const hitShip = updatedShips[board[coordinates.row][coordinates.col].shipId];
      
      if(hitShip.hits === hitShip.spaces) {
        setShipsDestroyed(prev => prev + 1);
      }
    }

  },[board, setTurn, ships, socket]);

  const startGame = () => {
    setIsGame(true);
    socket?.emit('player_ready');
  }

  
  useEffect(() => {
    if(shipsDestroyed === 5) {
      console.log('you lose')
    }
  }, [shipsDestroyed])

  useEffect(() => {
    createBoard();
  }, [createBoard]);

  useEffect(() => {
    socket?.on('opponent_shoot', (coordinates: {row: number, col: number}) => {
      updateBoard(coordinates);      
    });

    return () => {
      socket?.off('opponent_shoot')
    }
      
  }, [socket, updateBoard]);

  useEffect(() => {
   
    socket?.on('opponent_ready', () => {
      setReady();
    });
    socket?.on('start_game', () => {
      setTurn(true);
      console.log('game')
    });
    return () => {
      socket?.off('opponent_ready');
      socket?.off('start_game');
    }
  }, [setReady, setTurn, socket])

  return (
    <div
      className='xl:w-[1200px] w-[350px] m-auto overflow-hidden h-[100vh]'
    > 
      <div className='p-5 text-center'>
        <h1>{`${uid} aginst: ${opponent?.uid}`}</h1>
      </div>
      <div>
        <h1>{isGame && opponent?.ready && (yourTurn ? 'Your turn' : 'Opponent turn')}</h1>
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-2'>
        {board && <Board board={board} cellClicked={cellClicked}/>}
        {isGame ? 
          (  
            opponent?.ready ? 
              (
                <OpponentBoard boardSize={boardSize}/>
              ) : (
                'Waiting for opponent to be ready'
              )
          ) : (
            <ShipsContainer ships={ships} setShips={setShips} startGame={startGame}/>
          )
          
        }
        
        
      </div>
    </div>
  )
}

export default Game