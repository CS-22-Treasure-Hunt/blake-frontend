import React from 'react';
import ReactDOM from 'react-dom';
import Dungeon from './Dungeon';

it('renders', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dungeon />, div);
  ReactDOM.unmountComponentAtNode(div);
});