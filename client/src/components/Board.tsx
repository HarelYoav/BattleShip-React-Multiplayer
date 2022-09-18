import {memo, useEffect, useState} from 'react'
import Cell from './Cell';
import { ICell, IShip } from '../types';
import { ShipStore } from '../store/authStore';

interface IProps {
  board: ICell[][];
  cellClicked: (cell: ICell) => void;
}

const Board = memo(({board, cellClicked}: IProps) => {

  

  console.log('Board')

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