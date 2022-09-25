import {useEffect, useState, useContext, useCallback} from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Cell from './Cell';
import { IOpponentCell } from '../types';
import {useGameStore} from '../store/authStore';

interface IProps {
  boardSize: number;
}

const OpponentBoard = ({boardSize}: IProps) => {
  
  const { socket } = useContext(SocketContext).SocketState;
  const {yourTurn, setTurn} = useGameStore();
  const [board, setBoard] = useState<IOpponentCell[][]>();

  const createBoard = useCallback(() => {
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

    setBoard(newBoard);
  }, [boardSize]);

  const cellClicked = (cell: IOpponentCell) => {
    if(!yourTurn) return;
    setTurn(false);
    socket?.emit('player_shoot',  cell.coordinates);

  };

  const updateBoard = (coordinates: {row: number, col: number}, isHit: boolean) => {
    console.log('oppoBoard')
    setBoard((board) => {
      if (board) {
        const updatedBoard = [...board];
        if(isHit) {
          updatedBoard[coordinates.row][coordinates.col].state = 'hit';
        } else {
          updatedBoard[coordinates.row][coordinates.col].state = 'missed';
        }
        return updatedBoard;
      }
    });
    
  };

  useEffect(() => {
    if(!board) {
      createBoard();
    }
    socket?.on('player_shoot_feedback', (cooridnates: { row:number, col:number}, isHit: boolean) => {
      updateBoard(cooridnates, isHit);
    });

    return () => {
      socket?.off('player_shoot_feedback');
    }
  }, [board, createBoard, socket]);



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