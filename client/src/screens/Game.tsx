import { useContext, useState, useEffect } from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Board from '../components/Board';
import { IShip, ICell } from '../types';
import { ShipStore } from '../store/authStore';
import ShipsContainer from '../components/ShipsContainer';
import { shipsData } from '../utils/shipsData';





const Game = () => {

  const { socket, play_against} = useContext(SocketContext).SocketState;
  const { selectedShip, setSelectedShip } = ShipStore();

  const boardSize = 10;
  
  const [board, setBoard] = useState<ICell[][]>(new Array(boardSize));
  const [ships, setShips] = useState<IShip[]>(shipsData);

  const createBoard = () => {
    const newBoard= [...board];

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
          shipId: -1
        };
        newBoard[row][col] = cell;
      }
    }

    setBoard(newBoard);
  }

  //This function is called when click on board cell
  const cellClicked = (cell: ICell) => {
    //if selected ship invoke placeShip function
    if(selectedShip) placeShip(cell.coordinates)
    else if(cell.isShip) removeShipFromBoard(cell.shipId)


  }

  const removeShipFromBoard = (shipId: number) => {
    const updatedShips = [...ships];
    const updateBoard = [...board];
    //place the ship on the board
    const ship = updatedShips[shipId];
    if(ship.rotate) {
      for(let i = ship.coordinates.row; i < (ship.spaces + ship.coordinates.row); i++) {
        updateBoard[i][ship.coordinates.col].isShip = false;
        updateBoard[i][ship.coordinates.col].shipId = -1;
      }
    } else {
      for(let i = ship.coordinates.col; i < (ship.spaces + ship.coordinates.col); i++) {
        updateBoard[ship.coordinates.row][i].isShip = false;
        updateBoard[ship.coordinates.row][i].shipId = -1;
      }
    }
    
    updatedShips[shipId].isPlaced = false;
    setShips(updatedShips);
    setBoard(updateBoard);
    console.log(shipId)
  }

  //This function place ship on the board
  const placeShip = (coordinates: {row: number, col: number}) => {
    //exit the function if no selected ship to place
    if(!selectedShip) return;
    //board to update
    const updateBoard = [...board];
    if(selectedShip.rotate) { //Place ship vertically
      //if the location is not fit to the ship size
      if (!(((selectedShip.spaces + coordinates.row) - 1) < 10)) return;//replace 10 to boardSize
      //check if all the cells are empty and return if one of the cell has ship on it
      for(let i = coordinates.row; i < (selectedShip.spaces + coordinates.row); i++) {
        if(updateBoard[i][coordinates.col].isShip) return;
      }
      //place the ship on the board
      for(let i = coordinates.row; i < (selectedShip.spaces + coordinates.row); i++) {
        updateBoard[i][coordinates.col].isShip = true;
        updateBoard[i][coordinates.col].shipId = selectedShip.id;
      }
        
    } else { //Place ship horizontal
      //if the location is fit to the ship size
      if (!(((selectedShip.spaces + coordinates.col) - 1) < 10)) return;//replace 10 to boardSize
      //check if all the cells are empty and return if one of the cell has ship on it
      for(let i = coordinates.col; i < (selectedShip.spaces + coordinates.col); i++) {
        if(updateBoard[coordinates.row][i].isShip) return;
      }
      //place the ship on the board
      for(let i = coordinates.col; i < (selectedShip.spaces + coordinates.col); i++) {
        updateBoard[coordinates.row][i].isShip = true;
        updateBoard[coordinates.row][i].shipId = selectedShip.id;
      }
    }
    //set the updated board with the new ship
    setBoard(updateBoard);
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


  useEffect(() => {
    createBoard();
  }, [])

  console.log('Game')

  return (
    <div
      className='xl:w-[1200px] w-[350px] m-auto overflow-hidden h-[100vh]'
    > 
      <div className='p-5 text-center'>
        <h1>{`${socket?.id} aginst: ${play_against?.socketId}`}</h1>
      </div>
      <div className='grid grid-cols-1 xl:grid-cols-2'>
        <Board board={board} cellClicked={cellClicked}/>
        <ShipsContainer ships={ships} setShips={setShips}/>
      </div>
    </div>
  )
}

export default Game