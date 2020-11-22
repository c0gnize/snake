import * as React from 'react';
import style from './index.css';

const enum Direction {
  left,
  up,
  right,
  down
}

const DIR_KEYS: { [key: number]: Direction } = {
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down
};

const REVERSE_DIR_KEYS: { [key: number]: Direction } = {
  [Direction.left]: Direction.right,
  [Direction.up]: Direction.down,
  [Direction.right]: Direction.left,
  [Direction.down]: Direction.up
};

export const GameBoard: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const [state, dispatch] = React.useReducer(reducer, cfg, () => getIninitalState(cfg));

  React.useEffect(() => {
    const handle = setTimeout(() => dispatch({ type: 'move' }), state.speed);
    return () => clearTimeout(handle);
  }, [state.snake[0].x, state.snake[0].y]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = DIR_KEYS[e.keyCode];
      if (dir !== undefined && REVERSE_DIR_KEYS[dir] !== state.direction) {
        dispatch({ type: 'moveImmediate', direction: dir });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className={cn(style.app, style.flexcol, style.flexcenter)}>
      <div className={style.flexcol} style={{ width: cfg.xx * cfg.size }}>
        <div className={style.info}>
          <div>Score: {state.snake.length - 2}</div>
          <div>Speed: {state.speed / 1000}</div>
        </div>
        <div
          className={cn(style.board, style.flexcol, style.flexcenter)}
          style={{
            width: cfg.xx * cfg.size,
            height: cfg.yy * cfg.size,
            backgroundSize: `${cfg.size}px ${cfg.size}px`,
          }}
        >
          {state.snake.map((d, i) => (
            <div
              key={i}
              className={cn(style.abs, style.snake)}
              style={{
                left: d.x * cfg.size,
                top: d.y * cfg.size,
                width: cfg.size,
                height: cfg.size
              }}
            />
          ))}
          <div
            className={style.abs}
            style={{
              left: state.food.pos.x * cfg.size,
              top: state.food.pos.y * cfg.size,
              width: cfg.size,
              height: cfg.size
            }}
          >
            {state.food.type === FoodType.apple ? '\uD83C\uDF4E' : '\uD83C\uDF4C'}
          </div>
          {(state.win && !state.gameOver) && (
            <div className={style.msg}>Win</div>
          )}
          {state.gameOver && (
            <div className={style.msg}>Game over</div>
          )}
        </div>
      </div>
    </div>
  );
};

function reducer(prevState: State, action: Action) {
  const nextDir = action.type === 'move' ? prevState.direction : action.direction;
  const nextPos = getNextPos(prevState.snake[0], nextDir);
  if (isWin(nextPos, prevState.snake, prevState.config)) {
    return { ...prevState, win: true };
  } else if (isGameOver(nextPos, prevState.snake, prevState.config)) {
    return { ...prevState, gameOver: true };
  }
  return getNextState(prevState, nextPos, nextDir, prevState.config);
};

function cn(...classNames: (string | boolean)[]) {
  return classNames.filter(c => typeof c === 'string').join(' ');
}

export type Config = {
  yy: number;
  xx: number;
  size: number;
  speed: number;
  speedStep: number;
  appleRatio: number;
}

const enum FoodType {
  apple,
  fruit
}

type Position = {
  x: number;
  y: number;
};

type Snake = Position[];

type Food = {
  pos: Position;
  type: FoodType;
}

type State = {
  snake: Snake;
  food: Food;
  speed: number;
  direction: Direction;
  win: boolean;
  gameOver: boolean;
  config: Config;
}

type Action = { type: 'move' } | { type: 'moveImmediate', direction: Direction };

function getIninitalState(cfg: Config): State {
  const snake: Snake = [{ x: 1, y: 0 }, { x: 0, y: 0 }];
  return {
    snake,
    food: placeFood(snake, cfg),
    direction: Direction.right,
    speed: cfg.speed,
    win: false,
    gameOver: false,
    config: cfg
  };
}

function getNextPos(pos: Position, dir: Direction): Position {
  if (dir === Direction.right) {
    return { x: pos.x + 1, y: pos.y };
  } else if (dir === Direction.down) {
    return { x: pos.x, y: pos.y + 1 };
  } else if (dir === Direction.left) {
    return { x: pos.x - 1, y: pos.y };
  } else {
    return { x: pos.x, y: pos.y - 1 };
  }
}

function isWin(nextPos: Position, snake: Snake, cfg: Config): boolean {
  return (
    snake.length === cfg.xx * cfg.yy - 1 &&
    !isInSnake(nextPos, snake)
  );
}

function isGameOver(nextPos: Position, snake: Snake, cfg: Config): boolean {
  return (
    nextPos.x < 0 ||
    nextPos.y < 0 ||
    nextPos.x >= cfg.xx ||
    nextPos.y >= cfg.yy ||
    isInSnake(nextPos, snake)
  );
}

function isInSnake(pos: Position, snake: Snake): boolean {
  return snake.some(d => isSamePos(d, pos));
}

function isSamePos(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

function placeFood(snake: Snake, cfg: Config): Food {
  const pos = { x: 0, y: 0 };
  // TODO: use another algorithm
  for (let i = 0; i < cfg.xx * cfg.yy; i++) {
    pos.x = Math.floor(Math.random() * cfg.xx);
    pos.y = Math.floor(Math.random() * cfg.xx);
    if (!isInSnake(pos, snake)) {
      break;
    }
  }
  return {
    type: Math.random() < cfg.appleRatio ? FoodType.apple : FoodType.fruit,
    pos
  };
}

function getNextState(state: State, nextPos: Position, nextDir: Direction, cfg: Config): State {
  const nextState: State = { ...state, direction: nextDir };
  nextState.snake.unshift(nextPos);
  const eat = isSamePos(nextPos, nextState.food.pos);
  if (eat) {
    const type = nextState.food.type;
    if (type === FoodType.apple) {
      nextState.speed = Math.max(500, nextState.speed + cfg.speedStep);
    } else if (type === FoodType.fruit) {
      nextState.snake.push({ x: -1, y: -1 });
    }
  }
  nextState.snake.pop();
  if (eat) {
    nextState.food = placeFood(nextState.snake, cfg);
  }
  return nextState;
}
