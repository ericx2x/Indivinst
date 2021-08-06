import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Indivinst from './Indivinst';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Indivinst />, document.getElementById('root'));
registerServiceWorker();
