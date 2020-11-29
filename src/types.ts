export type Config = {
  rows: number;
  cols: number;
  cellSize: number;
  delayMs: number;
  maxSpeed: number;
  appleRatio: number;
};

export enum Direction {
  left,
  up,
  right,
  down,
}

export type SnakeData = Pos[];

export type Pos = {
  x: number;
  y: number;
};

export type FoodData = {
  pos: Pos;
  type: FoodType;
};

export enum FoodType {
  apple,
  fruit,
}

export type Action =
  | { type: 'move' }
  | { type: 'moveImmediate'; dir: Direction };
