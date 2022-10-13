import {memo} from 'react'
import Cell from './Cell';
import {Grid, Container} from '@mui/material';
import { ICell, IOpponentCell} from '../types';

interface IProps {
  board: ICell[][];
  cellClicked: (cell: ICell | IOpponentCell) => void;
}

const Board = memo(({board, cellClicked}: IProps) => {

  return (
    <Container maxWidth="md">
      {board?.map((row, xidx) => {
        return (
          <Grid container key={xidx}>
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
    </Container>
  )
})

export default Board