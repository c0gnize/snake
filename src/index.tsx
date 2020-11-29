import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Board } from './board';

ReactDOM.render(
  <Board cfg={{
    rows: 15,
    cols: 15,
    cellSize: 20,
    delayMs: 1000,
    maxSpeed: 10,
    appleRatio: 0.2
  }} />,
  document.getElementById('root')
);
