import React, {useState} from 'react'
import { ICell, IOpponentCell } from '../types';


interface IProps {
  cell: ICell | IOpponentCell;
  cellClicked: (cell: ICell | IOpponentCell) => void;
}



const Cell = ({ cell, cellClicked }: IProps) => {

  const istanceOfICell = (obj: any) => {
    return 'isShip' in obj;
  }

  let style = 'xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-white';

  if(istanceOfICell(cell)) {
    const tmpCell = cell as ICell;
    if(tmpCell.isShip) {
      style = 'xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-gray-300';
    }
  } else {
    const tmpCell = cell as IOpponentCell;
    if(tmpCell.state ==='missed') {
      style = 'xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-green-300';
    } else if(tmpCell.state === 'hit') {
      style = 'xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-red-300';
    }
  }
  

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