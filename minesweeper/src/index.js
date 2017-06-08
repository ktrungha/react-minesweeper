import React from 'react';
import ReactDOM from 'react-dom';
import Minesweeper from './component/Minesweeper';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<Minesweeper />, document.getElementById('root'));
registerServiceWorker();
