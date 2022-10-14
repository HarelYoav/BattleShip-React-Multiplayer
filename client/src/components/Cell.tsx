import { ICell, IOpponentCell } from '../types';
import { Grid, Tooltip, ThemeProvider, createTheme } from '@mui/material';
import LocalFireDepartmentTwoToneIcon from '@mui/icons-material/LocalFireDepartmentTwoTone';

interface IProps {
  cell: ICell | IOpponentCell;
  cellClicked: (cell: ICell | IOpponentCell) => void;
}

const theme = createTheme({
  palette: {
    mode: 'dark'
  },
});

const Cell = ({ cell, cellClicked }: IProps) => {

  const istanceOfICell = (obj: any) => {
    return 'isShip' in obj;
  }

  let style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg';

  let Icell;
  let IopponentCell;

  if(istanceOfICell(cell)) {
    Icell = cell as ICell;
    // if(tmpCell.isShip && tmpCell.shootOn) {
    //   style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-red-300';
    // }
    if(Icell.isShip) {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-gray-300';
    } 

  } else {
    IopponentCell = cell as IOpponentCell;
    if(IopponentCell.state ==='missed') {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-red-300';
    } else if(IopponentCell.state === 'hit') {
      style = 'flex-1 xl:h-14 h-8 border rounded-sm flex items-center justify-center shadow-lg bg-green-300';
    }
  }
  
  return (
    <ThemeProvider theme={theme}>
    <Grid item
      xs={1.2}
      className={style}
      role='button'
      onClick={() => cellClicked(cell)}
    >
      {((Icell?.isShip && Icell?.shootOn) || IopponentCell?.state === 'hit')
        && 
        <Tooltip title="Hit">
          <LocalFireDepartmentTwoToneIcon style={{fill: "red"}}/>
        </Tooltip>
      }
        
        
      {((!Icell?.isShip && Icell?.shootOn) || IopponentCell?.state === 'missed') && 'X'}
    </Grid>
    </ThemeProvider>
  )
}

export default Cell;