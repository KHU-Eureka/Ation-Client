import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './App';

let initialState = {
  auth: false,
  activePersonaId: null,
  clickedPersonId: 0,
  menu: null,
  mode: "",
  detail_mode: "",
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
    case 'CLICKED_PERSONA':
      tempState.clickedPersonId = action.data;
      break;
    case 'MENU':
      tempState.menu = action.data;
      break;
    case 'MODE':
      tempState.mode = action.data;
      break;
    case 'DETAIL_MODE':
      tempState.detail_mode = action.data;
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