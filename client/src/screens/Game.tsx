import { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SocketContext from '../contexts/Socket/SocketContext';
import Board from '../components/Board';
import { IShip, ICell, IOpponentCell } from '../types';
import { ShipStore } from '../store/authStore';
import ShipsContainer from '../components/ShipsContainer';
import OpponentBoard from '../components/OpponentBoard';
import { shipsData } from '../utils/shipsData';
import { useGameStore } from '../store/authStore';
import EndGame from '../components/EndGame';
import { Container, Box, Grid, Typography } from '@mui/material';



const Game = () => {

  const boardSize = 10;
  const { socket } = useContext(SocketContext).SocketState;
  const { opponent, setOpponentReady, yourTurn, setTurn } = useGameStore();
  const { selectedShip, setSelectedShip } = ShipStore();
  const navigate = useNavigate();
  const [board, setBoard] = useState<ICell[][]>();
  const [opponentBoard, setOpponentBoard] = useState<IOpponentCell[][]>();
  const [ships, setShips] = useState<IShip[]>();
  const [isGame, setIsGame] = useState<boolean>();
  const [shipsDestroyed, setShipsDestroyed] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  //Create current player board
  //and create array of the player
  const createGameBoard = useCallback(() => {
    const newBoard = new Array(boardSize);
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
    
    const newShips: IShip[] = new Array(shipsData.length);
    for( let i = 0; i < newShips.length; i++) {
      newShips[i] = shipsData[i];
      newShips[i].isPlaced = false;
      newShips[i].rotate = false;
      newShips[i].hits = 0;
    };
    setShips(newShips);

  }, []);


  //Create state for Opponent board
  const createOpponentBoard = useCallback(() => {
    const newBoard = new Array(boardSize);

    for(let row = 0; row < boardSize; row++) {
      newBoard[row] = new Array(boardSize)
      for(let col = 0; col < boardSize; col++) {
        const cell: IOpponentCell = {
          coordinates: {
            row: row,
            col: col
          },
          state: 'free',
        };
        newBoard[row][col] = cell;
      }
    }

    setOpponentBoard(newBoard);
  }, [boardSize]);


  //This function is called when click on board cell
  const cellClicked = (cell: ICell | IOpponentCell) => {
    //if selected ship invoke placeShip function
    const tmpCell = cell as ICell;
    if(selectedShip) placeShip(cell.coordinates);
    else if(tmpCell.isShip) removeShipFromBoard(tmpCell.shipId);
  }

  //This function remove a ship from the board
  //used when player arrange his ships before the game start
  const removeShipFromBoard = (shipId: number) => {

    //No board | no ships | already pressed start game
    if(!board || !ships || isGame) return;

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
    const updatedShips = ships?.map(ship => {
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


  //This function get call when the opponent is shoot
  //update current player board (Hit or miss)
  //and check if a ship was destroyed
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
    if(isHit && ships) {
      const updatedShips = [...ships];
      updatedShips[board[coordinates.row][coordinates.col].shipId].hits++;
      setShips(updatedShips);
      const hitShip = updatedShips[board[coordinates.row][coordinates.col].shipId];
      
      if(hitShip.hits === hitShip.spaces) {
        setShipsDestroyed(prev => prev + 1);
      }
    }

  },[board, setTurn, ships, socket]);

  //When player finish to arrange his ship and press play
  //send notification to the server that the player is ready
  const startGame = () => {
    setIsGame(true);
    socket?.emit('player_ready');
  }

  //This function get called when one of the player wins
  const endGame = useCallback(() => {
    setGameOver(true);
  }, [setOpponentReady])

  
  useEffect(() => {
    if(shipsDestroyed === 5) {
      console.log('you lose');
      socket?.emit('game_over');
      endGame();

    }
  }, [endGame, shipsDestroyed, socket])

  useEffect(() => {
    if(!board) {
      createGameBoard();
    }
  }, [board, createGameBoard]);

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
      setOpponentReady(true);
    });
    socket?.on('start_game', () => {
      setTurn(true);
    });
    socket?.on('you_won', () => {
      console.log('you won');
      setWin(true);
      endGame();
    });
    socket?.on('back_to_menu', () => {
      navigate('/');
    })
    return () => {
      socket?.off('opponent_ready');
      socket?.off('start_game');
      socket?.off('back_to_menu');
    }
  }, [endGame, navigate, setOpponentReady, setTurn, socket])

  return (
    <Container maxWidth="xl">
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} mt={1} py={1}>
        <Typography variant='h6'>{isGame && opponent?.ready && (yourTurn ? 'Your turn' : 'Opponent turn')}</Typography>
      </Box>
      <Grid container spacing={2} pb={2} display={'flex'} flexDirection={{xs: isGame ? 'column-reverse' : 'column', md: 'row'}}>
        <Grid item xs={12} md={6}>
          {gameOver &&
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <EndGame 
                  createGameBoard={createGameBoard} 
                  createOpponentBoard={createOpponentBoard}
                  setIsGame={setIsGame}
                  setGameOver={setGameOver}
                  setShipsDestroyed={setShipsDestroyed}
                  win={win}
                />
            </div>
          }
          {board && <Board board={board} cellClicked={cellClicked}/>}
        </Grid>
        
        {isGame ? (  
          <Grid item xs={12} md={6}>
            {opponent?.ready ? (
              <OpponentBoard 
                createOpponentBoard={createOpponentBoard}
                opponentBoard={opponentBoard}
                setOppnentBoard={setOpponentBoard}
              />
            ) : (
              !gameOver && 
                <Typography textAlign='center' sx={{mt: 1, p:1}}>
                  Waiting for opponent to start the game
                </Typography>
            )}
          </Grid>
        ) : (
          <Grid item xs={12} md={6}>
            <ShipsContainer ships={ships} setShips={setShips} startGame={startGame}/>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default Game