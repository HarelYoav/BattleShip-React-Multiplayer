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

  const cellClicked = (coordinates: {row: number, col: number}) => {

    socket?.emit('shoot', play_against?.socketId, coordinates);
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
                  cellClicked={() => cellClicked(cell.coordinates)}
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