import {memo} from 'react'
import Cell from './Cell';
import {Grid,Box, Container, Typography} from '@mui/material';
import { ICell, IOpponentCell} from '../types';

interface IProps {
  board: ICell[][];
  cellClicked: (cell: ICell | IOpponentCell) => void;
}

const Board = memo(({board, cellClicked}: IProps) => {

  return (
    <Box maxWidth="sm">
      <Typography textAlign='center' sx={{m: 1, p:1}}>
        Your Ships
      </Typography>
      {board?.map((row, xidx) => {
        return (
          <Grid container key={xidx} display={'flex'} justifyContent={'center'} alignItems={'center'}>
            {row && row.map((cell, yidx) => {
              return (
                <Cell
                  key={`[${xidx}, ${yidx}]`}
                  cell={cell}
                  cellClicked={cellClicked}
                />
              )
            })}
          </Grid>
        )
      })}
    </Box>
  )
})

export default Board