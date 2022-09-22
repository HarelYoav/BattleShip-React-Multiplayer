import {memo, useEffect, useState} from 'react'
import Cell from './Cell';
import { ICell, IOpponentCell} from '../types';
import {Socket} from 'socket.io-client'

interface IProps {
  board: ICell[][];
  cellClicked: (cell: ICell | IOpponentCell) => void;
  socket: Socket | undefined;
}

const Board = memo(({board, cellClicked, socket}: IProps) => {

  return (
    <div className='border'>
      {board?.map((row, xidx) => {
        return (
          <div key={xidx} className='flex m-auto inline-block'>
            {row && row.map((cell, yidx) => {
              return (
                <Cell
                  key={`[${xidx}, ${yidx}]`}
                  cell={cell}
                  cellClicked={cellClicked}
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