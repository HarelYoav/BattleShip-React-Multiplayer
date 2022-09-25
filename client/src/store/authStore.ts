import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IShip, ICell } from '../types';

interface IOpponent {
  uid: string;
  ready: boolean;
}

type GameStore = {
  opponent: IOpponent | null;
  yourTurn: boolean;
  setOpponent: (uid: string) => void;
  setReady: () => void;
  setTurn: (turn: boolean) => void;
} 

const useGameStore = create<GameStore>()(persist(set => ({
  opponent: null,
  yourTurn: false,
  setOpponent(uid: string) {
    const opponent: IOpponent = {
      uid: uid,
      ready: false
    }
    set({opponent: opponent});
  },
  setReady() {
    set((state: any) => ({
      opponent: {
        ...state.opponent, 
        ready: true
      }
    }))
  },
  setTurn(turn: boolean) {
    set({ yourTurn: turn });
  }
})));

type BoardStoreState = {
  board: ICell[][] | null;
  setBoard: (updatedBoard: ICell[][]) => void;
}


const BoardStore = create<BoardStoreState>()(persist(set => ({
  board: null,
  setBoard(updatedBoard: ICell[][]) {
    set({ board: updatedBoard });
  },
})));

type SelectedShipStore = {
  selectedShip: IShip | null;
  setSelectedShip: (selectedShip: IShip | null) => void;
}


const ShipStore = create<SelectedShipStore>()(set => ({
  selectedShip: null,
  setSelectedShip(ship: IShip| null) {
    set({ selectedShip: ship });
  },
 
}));


export {ShipStore, BoardStore, useGameStore};

// type BoardStoreState = {
//   board: ICell[][];
//   setBoard: (board: ICell[][]) => void;
// }


// const BoardStore = create<BoardStoreState>()(persist( set => ({
//   board: new Array(10),
//   setBoard(board: ICell[][]) {
//     set({ board: board });
//   },
 
// })));