import create from 'zustand';
import { persist } from 'zustand/middleware';
import { IShip } from '../types';



// type SelectedShipStore = {
//   selectedShip: IShip | null;
//   setSelectedShip: (selectedShip: IShip) => void;
// }


// const ShipStore = create<SelectedShipStore>()(persist( set => ({
//   selectedShip: null,
//   setSelectedShip(ship: IShip) {
//     set({ selectedShip: ship });
//   },
 
// })));
type SelectedShipStore = {
  selectedShip: IShip | null;
  setSelectedShip: (selectedShip: IShip | null) => void;
}


const ShipStore = create<SelectedShipStore>()(( set => ({
  selectedShip: null,
  setSelectedShip(ship: IShip| null) {
    set({ selectedShip: ship });
  },
 
})));


  

export {ShipStore};