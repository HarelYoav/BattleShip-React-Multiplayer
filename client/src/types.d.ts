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
}

export interface ICell {
  isSelected: boolean;
  isShip: boolean;
  coordinates: {
    x: number;
    y: number;
  }
}