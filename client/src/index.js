import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import App from './App';
/*
function activePersonaReducer(state = null, action) {
  return action.payload
}
*/

let initialState = {
  activePersonaId: null,
}

function reducer(state = initialState, action) {
  let tempState = {...state};
  switch (action.type) {
    case 'CHANGEPERSONA':
      tempState.activePersonaId = action.data;
      break;
    default:
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