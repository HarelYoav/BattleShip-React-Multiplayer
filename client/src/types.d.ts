export interface IUser {
  _id: string,
  socketId: string;
  inGame: boolean;
}

export interface IShip {
  id: number;
  name: string;
  icon:string;
  spaces: number;
  rotate: boolean;
  isPlaced: boolean;
  coordinates: {
    row: number;
    col: number;
  }
}

export interface ICell {
  coordinates: {
    row: number;
    col: number;
  }
  isSelected: boolean;
  isShip: boolean;
  shipId: number;
  shootOn: boolean;
}

export interface IOpponentCell {
  coordinates: {
    row: number;
    col: number;
  }
  state: 'free' | 'missed' | 'hit';
}


