import * as React from 'react';
import { cn } from './class-names';
import { Config, Direction, FoodData, FoodType, SnakeData, } from './types';
import { useGameState } from './state';
import { Swipe } from './swipe';
import style from './index.css';

export const Board: React.FC<{ cfg: Config }> = ({ cfg }) => {
  const [state, dispatch] = useGameState(cfg);

  React.useEffect(() => {
    const id = setTimeout(() => dispatch({ type: 'move' }), state.delay);
    return () => clearTimeout(id);
  }, [state.snake[0].x, state.snake[0].y]);

  const moveTo = React.useCallback((dir: Direction) => {
    if (REVERSE_DIR[dir] !== state.dir) {
      dispatch({ type: 'moveImmediate', dir });
    }
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const dir = KEY_DIR[e.keyCode];
      if (dir !== undefined) {
        moveTo(dir);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  React.useEffect(() => {
    const swiper = new Swipe(moveTo);
    swiper.connect(window);
    return () => swiper.disconnect(window);
  }, []);

  const width = cfg.cols * cfg.cellSize;
  const height = cfg.rows * cfg.cellSize;

  return (
    <div className={cn(style.app, style.flexcol, style.flexcenter)}>
      <div className={style.flexcol} style={{ width }}>
        <div className={style.info}>
          <div>Score: {state.getScore()}</div>
          <div>Speed: {state.getSpeed()}</div>
        </div>
        <div
          className={cn(style.board, style.flexcol, style.flexcenter)}
          style={{ width, height, backgroundSize: `${cfg.cellSize}px ${cfg.cellSize}px` }}
        >
          <Snake data={state.snake} size={cfg.cellSize} />
          <Food data={state.food} size={cfg.cellSize} />
          {state.win && <div className={style.msg}>Win</div>}
          {state.defeat && <div className={style.msg}>Game over</div>}
        </div>
        <span className={style.tip}>
          Use the arrow keys to change the direction of the snake
        </span>
      </div>
    </div>
  );
};

const Snake: React.FC<{ data: SnakeData, size: number }> = ({ data, size }) => (
  <>
    {data.map((p, i) => (
      <div
        key={i}
        className={cn(style.abs, style.snake, !i && style.snakeHead)}
        style={{
          left: p.x * size - 1,
          top: p.y * size - 1,
          width: size + 2,
          height: size + 2
        }}
      />
    ))}
  </>
);

const Food: React.FC<{ data: FoodData, size: number }> = ({ data, size }) => (
  <div
    className={style.abs}
    style={{
      left: data.pos.x * size,
      top: data.pos.y * size,
      width: size,
      height: size
    }}
  >
    {data.type === FoodType.apple ? '\uD83C\uDF4E' : '\uD83C\uDF4C'}
  </div>
);

const KEY_DIR: { [key: number]: Direction } = {
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down
};

const REVERSE_DIR: { [direction: number]: Direction } = {
  [Direction.left]: Direction.right,
  [Direction.up]: Direction.down,
  [Direction.right]: Direction.left,
  [Direction.down]: Direction.up
};
