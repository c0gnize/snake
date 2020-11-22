import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GameBoard } from './board';

ReactDOM.render(
  <GameBoard cfg={{
    yy: 20,
    xx: 20,
    size: 20,
    speed: 2000,
    speedStep: -100,
    appleRatio: 0.25
  }} />,
  document.getElementById('root')
);
