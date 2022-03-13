import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { ReactComponent as Eye } from './assets/svg/sense/eye.svg';
import { ReactComponent as Nose } from './assets/svg/sense/nose.svg';
import { ReactComponent as Mouth } from './assets/svg/sense/mouth.svg';
import { ReactComponent as Hand } from './assets/svg/sense/hand.svg';
import { ReactComponent as Ear } from './assets/svg/sense/ear.svg';

import App from './App';

let initialState = {
  auth: false,
  activePersonaId: null,
  menu: null,
  senseInfoList: [
    { id: 1, svg: <Eye/> },
    { id: 2, svg: <Nose/> },
    { id: 3, svg: <Mouth/> },
    { id: 4, svg: <Hand/> },
    { id: 5, svg: <Ear/> },
  ]
}

function reducer(state = initialState, action) {
  let tempState = {...state};
  switch (action.type) {
    case 'AUTH':
      tempState.auth = action.data;
      break;
    case 'CHANGEPERSONA':
      tempState.activePersonaId = action.data;
      break;
    case 'MENU':
        tempState.menu = action.data;
        break;
    default:
      break;
  }
  return tempState;
}

let store = createStore(reducer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);