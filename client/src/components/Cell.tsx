import { ICell, IOpponentCell } from '../types';
import { Grid } from '@mui/material';

interface IProps {
  cell: ICell | IOpponentCell;
  cellClicked: (cell: ICell | IOpponentCell) => void;
}

const Cell = ({ cell, cellClicked }: IProps) => {

  const istanceOfICell = (obj: any) => {
    return 'isShip' in obj;
  }

  let style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-white';

  if(istanceOfICell(cell)) {
    const tmpCell = cell as ICell;
    if(tmpCell.isShip && tmpCell.shootOn) {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-red-300';
    }
    else if(tmpCell.isShip) {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-gray-300';
    } else if(tmpCell.shootOn) {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-yellow-300'
    }

  } else {
    const tmpCell = cell as IOpponentCell;
    if(tmpCell.state ==='missed') {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-green-300';
    } else if(tmpCell.state === 'hit') {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-red-300';
    }
  }
  
  return (
    <Grid xs={1.2}
      className={style}
      role='button'
      onClick={() => cellClicked(cell)}
    >
    </Grid>
  )
}

export default Cell;