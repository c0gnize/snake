import { useState, useCallback } from 'react';
import { binarySearch } from './binary-search';
import {
  Action,
  Config,
  Direction,
  FoodData,
  FoodType,
  Pos,
  SnakeData,
} from './types';

export function useGameState(
  cfg: Config,
): [GameState, (action: Action) => void] {
  const [state] = useState(() => new GameState(cfg));
  const [, forceUpdate] = useState(Object.create(null));
  const dispatch = useCallback((action: Action) => {
    state.dispatch(action);
    forceUpdate(Object.create(null));
  }, []);
  return [state, dispatch];
}

export class GameState {
  snake: Pos[];
  food: FoodData;
  delay: number;
  dir: Direction;
  win: boolean;
  defeat: boolean;

  constructor(private cfg: Config) {
    this.snake = [pos(1, 0), pos(0, 0)];
    this.food = placeFood(this.snake, cfg);
    this.dir = Direction.right;
    this.delay = cfg.delayMs;
    this.win = false;
    this.defeat = false;
    this.cfg = cfg;
  }

  getScore() {
    return this.snake.length - 2;
  }

  getSpeed() {
    return (
      1 +
      this.cfg.maxSpeed -
      (this.delay * this.cfg.maxSpeed) / this.cfg.delayMs
    );
  }

  dispatch(action: Action) {
    if (action.type === 'moveImmediate') {
      this.dir = action.dir;
    }
    const nextPos = getNextPos(this.snake[0], this.dir);
    if (isWin(nextPos, this.snake, this.cfg)) {
      this.win = true;
    } else if (isDefeat(nextPos, this.snake, this.cfg)) {
      this.defeat = true;
    } else {
      this.snake.unshift(nextPos);
      const eat = isSamePos(nextPos, this.food.pos);
      if (eat) {
        const type = this.food.type;
        if (type === FoodType.apple) {
          this.delay = Math.max(
            100,
            this.delay - this.cfg.delayMs / this.cfg.maxSpeed,
          );
        } else if (type === FoodType.fruit) {
          this.snake.push(pos(-1, -1));
        }
      }
      this.snake.pop();
      if (eat) {
        this.food = placeFood(this.snake, this.cfg);
      }
    }
  }
}

function getNextPos({ x, y }: Pos, dir: Direction): Pos {
  switch (dir) {
    case Direction.right:
      return pos(x + 1, y);
    case Direction.down:
      return pos(x, y + 1);
    case Direction.left:
      return pos(x - 1, y);
    default:
      return pos(x, y - 1);
  }
}

function isWin(nextPos: Pos, snake: SnakeData, cfg: Config): boolean {
  return snake.length === cfg.cols * cfg.rows - 1 && !isInSnake(nextPos, snake);
}

function isDefeat(nextPos: Pos, snake: SnakeData, cfg: Config): boolean {
  return (
    nextPos.x < 0 ||
    nextPos.y < 0 ||
    nextPos.x >= cfg.cols ||
    nextPos.y >= cfg.rows ||
    isInSnake(nextPos, snake)
  );
}

function isInSnake(pos: Pos, snake: SnakeData): boolean {
  return snake.some(d => isSamePos(d, pos));
}

function isSamePos(a: Pos, b: Pos): boolean {
  return a.x === b.x && a.y === b.y;
}

function placeFood(snake: SnakeData, cfg: Config): FoodData {
  const indexes = snake.map(p => getIndexByPos(p, cfg)).sort(lessNum);
  const maxLength = cfg.cols * cfg.rows - 1;
  let index: number;
  do {
    index = Math.floor(Math.random() * maxLength);
  } while (binarySearch(indexes, index));
  return {
    type: Math.random() < cfg.appleRatio ? FoodType.apple : FoodType.fruit,
    pos: getPosByIndex(index, cfg),
  };
}

function lessNum(a: number, b: number): number {
  return a - b;
}

function getIndexByPos(pos: Pos, cfg: Config): number {
  return pos.y * cfg.cols + (pos.x % cfg.cols);
}

function getPosByIndex(index: number, cfg: Config): Pos {
  return pos(Math.floor(index % cfg.cols), Math.floor(index / cfg.cols));
}

function pos(x: number, y: number): Pos {
  return { x, y };
}
