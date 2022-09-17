import {memo, useEffect, useState} from 'react'
import Cell from './Cell';
import { ICell } from '../types';

// interface IProps {
//   board: number[][];
//   setBoard: React.Dispatch<React.SetStateAction<number[][]>>;
// }




const Board = memo(() => {

  const boardSize = 10;
  
  const [board, setBoard] = useState<ICell[][]>();

  const createBoard = () => {
    const newBoard: ICell[][] = new Array(boardSize);

    for(let row = 0; row < boardSize; row++) {
      newBoard[row] = new Array(boardSize)
      for(let col = 0; col < boardSize; col++) {
        const cell: ICell = {
          isSelected: false,
          isShip: false,
          coordinates: {
            x: row,
            y: col
          }
        };
        newBoard[row][col] = cell;
      }
    }

    setBoard(newBoard);
  }

  useEffect(() => {
    createBoard();
  }, [])

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
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )
})

export default Board