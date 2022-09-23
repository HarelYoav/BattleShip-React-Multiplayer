import {useEffect, useState, useContext} from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Cell from './Cell';
import { IOpponentCell } from '../types';

interface IProps {
  boardSize: number;
}

const OpponentBoard = ({boardSize}: IProps) => {
  
  const { socket, play_against} = useContext(SocketContext).SocketState;
  const [board, setBoard] = useState<IOpponentCell[][]>(new Array(boardSize));
  const [shootCoordinates, setShootCoordinates] = useState<{row: number, col: number}>();

  const createBoard = () => {
    const newBoard= [...board];

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

    setBoard(newBoard);
  }

  const cellClicked = (cell: IOpponentCell) => {
    
    // console.log(cell.coordinates);
    setShootCoordinates(cell.coordinates);
    
  }

  const updateBoard = async (isHit: boolean) => {
    
    if(shootCoordinates) {
      console.log(shootCoordinates)
      const updatedBoard = [...board];
      if(isHit) {
        updatedBoard[shootCoordinates.row][shootCoordinates.col].state = 'hit';
      } else {
        updatedBoard[shootCoordinates.row][shootCoordinates.col].state = 'missed';
      }
      setBoard(updatedBoard);
    }
    // console.log('hi')
  }

  useEffect(() => {
    if(shootCoordinates) {
      socket?.emit('player_shoot', play_against?.socketId, shootCoordinates);
    }
    console.log(shootCoordinates)

  },[shootCoordinates]);

  useEffect(() => {
    createBoard();
    socket?.on('player_shoot_feedback', (cooridnates: { row:number, col:number}, isHit: boolean) => {
      updateBoard(cooridnates, isHit);
    });
  }, []);



  return (
    <div className='border'>
      {board?.map((row, xidx) => {
        return (
          <div key={xidx} className='flex m-auto inline-block'>
            {row.map((cell, yidx) => {
              return (
                <Cell
                  key={`[${xidx}, ${yidx}]`}
                  cell={cell}
                  cellClicked={() => cellClicked(cell)}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
};

export default OpponentBoard;