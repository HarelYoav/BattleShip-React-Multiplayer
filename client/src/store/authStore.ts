import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IShip, ICell } from '../types';


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

type BoardStoreState = {
  board: ICell[][];
  setBoard: (updatedBoard: ICell[][]) => void;
  getBoard: () => ICell[][];
}


const BoardStore = create<BoardStoreState>()(set => ({
  board: new Array(10),
  setBoard(updatedBoard: ICell[][]) {
    set({ board: updatedBoard });
  },
  getBoard() {
    return this.board;
  }
}));

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


  

export {ShipStore, BoardStore};