import {useEffect, useContext, useCallback} from 'react'
import SocketContext from '../contexts/Socket/SocketContext';
import Cell from './Cell';
import { IOpponentCell } from '../types';
import {useGameStore} from '../store/authStore';
import {Grid, Container, Typography} from '@mui/material';



interface IProps {
  createOpponentBoard: () => void;
  opponentBoard: IOpponentCell[][] | undefined;
  setOppnentBoard: React.Dispatch<React.SetStateAction<IOpponentCell[][] | undefined>>;
}

const OpponentBoard = ({createOpponentBoard, opponentBoard, setOppnentBoard}: IProps) => {
  
  const { socket } = useContext(SocketContext).SocketState;
  const {yourTurn, setTurn} = useGameStore();

  

  const cellClicked = (cell: IOpponentCell) => {
    if(!yourTurn || cell.state !== 'free') return;
    setTurn(false);
    socket?.emit('player_shoot',  cell.coordinates);

  };

  const updateBoard = useCallback((coordinates: {row: number, col: number}, isHit: boolean) => {
    console.log('oppoBoard')
    setOppnentBoard((board) => {
      if (board) {
        const updatedBoard = [...board];
        if(isHit) {
          updatedBoard[coordinates.row][coordinates.col].state = 'hit';
        } else {
          updatedBoard[coordinates.row][coordinates.col].state = 'missed';
        }
        return updatedBoard;
      }
    });
    
  },[setOppnentBoard]);

  useEffect(() => {
    if(!opponentBoard) {
      createOpponentBoard();
    }
    socket?.on('player_shoot_feedback', (cooridnates: { row:number, col:number}, isHit: boolean) => {
      updateBoard(cooridnates, isHit);
    });

    return () => {
      socket?.off('player_shoot_feedback');
    }
  }, [opponentBoard, createOpponentBoard, socket, updateBoard]);



  return (
    <Container maxWidth="sm">
      <Typography textAlign='center' sx={{m:1, p:1}}>
        Opponent
      </Typography>
      {opponentBoard?.map((row, xidx) => {
        return (
          <Grid container key={xidx}>
            {row.map((cell, yidx) => {
              return (
                <Cell
                  key={`[${xidx}, ${yidx}]`}
                  cell={cell}
                  cellClicked={() => cellClicked(cell)}
                />
              )
            })}
          </Grid>
        )
      })}
    </Container>
  )
};

export default OpponentBoard;