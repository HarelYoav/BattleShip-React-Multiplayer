import {memo} from 'react'
import Cell from './Cell';
import { ICell, IOpponentCell} from '../types';

interface IProps {
  board: ICell[][];
  cellClicked: (cell: ICell | IOpponentCell) => void;
}

const Board = memo(({board, cellClicked}: IProps) => {

  return (
    <div className='border m-1'>
      {board?.map((row, xidx) => {
        return (
          <div key={xidx} className='flex'>
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