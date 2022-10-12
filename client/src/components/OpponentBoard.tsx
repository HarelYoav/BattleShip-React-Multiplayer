import {useEffect, useState, useContext, useCallback} from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Cell from './Cell';
import { IOpponentCell } from '../types';
import {useGameStore} from '../store/authStore';

interface IProps {
  createOpponentBoard: () => void;
  opponentBoard: IOpponentCell[][] | undefined;
  setOppnentBoard: React.Dispatch<React.SetStateAction<IOpponentCell[][] | undefined>>;
}

const OpponentBoard = ({createOpponentBoard, opponentBoard, setOppnentBoard}: IProps) => {
  
  const { socket } = useContext(SocketContext).SocketState;
  const {yourTurn, setTurn} = useGameStore();

  

  const cellClicked = (cell: IOpponentCell) => {
    if(!yourTurn || cell.state !== 'free') return;
    setTurn(false);
    socket?.emit('player_shoot',  cell.coordinates);

  };

  const updateBoard = (coordinates: {row: number, col: number}, isHit: boolean) => {
    console.log('oppoBoard')
    setOppnentBoard((board) => {
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
    if(!opponentBoard) {
      createOpponentBoard();
    }
    socket?.on('player_shoot_feedback', (cooridnates: { row:number, col:number}, isHit: boolean) => {
      updateBoard(cooridnates, isHit);
    });

    return () => {
      socket?.off('player_shoot_feedback');
    }
  }, [opponentBoard, createOpponentBoard, socket]);



  return (
    <div className='border m-1'>
      {opponentBoard?.map((row, xidx) => {
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