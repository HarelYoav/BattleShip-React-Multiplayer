import React, {useState} from 'react'
import { ICell, IShip } from '../types';


interface IProps {
  cell: ICell;
  cellClicked: (cell: ICell) => void;
}



const Cell = ({ cell, cellClicked }: IProps) => {

  let style = 'xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-white';

  if(cell.isShip) {
    style = 'xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-gray-300'
  }
  
  // console.log('hi')

  return (
    <div
      className={style}
      role='button'
      onClick={() => cellClicked(cell)}
    >
      
    </div>
  )
}

export default Cell