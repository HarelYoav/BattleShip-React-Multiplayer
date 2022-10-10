import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IShip, ICell } from '../types';


interface IOpponent {
  uid: string;
  ready: boolean;
}

type GameStore = {
  uid: string;
  opponent: IOpponent | null;
  yourTurn: boolean;
  setUid: (uid: string) => void;
  setOpponent: (uid: string) => void;
  setReady: () => void;
  setTurn: (turn: boolean) => void;
  clearState: () => void;
} 

const useGameStore = create<GameStore>()(persist(set => ({
  uid: '',
  opponent: null,
  yourTurn: false,
  setUid(newUid: string) {
    set({uid: newUid})
  },
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
  },
  clearState() {
    set((state: any) => ({
      opponent: null,
      yourTurn: false
    }))
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