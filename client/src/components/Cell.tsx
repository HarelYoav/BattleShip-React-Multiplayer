import React, {useState} from 'react'
import { ICell } from '../types';


interface IProps {
  cell: ICell;
}

const Cell = ({ cell }: IProps) => {
  console.log(cell)
  return (
    <div
      className='xl:w-12 xl:h-12 w-8 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-white'
      role='button'
    >
      
    </div>
  )
}

export default Cell