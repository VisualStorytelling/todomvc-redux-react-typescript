import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store, createStore, applyMiddleware, Reducer } from 'redux';
import { Provider } from 'react-redux';

import App from './main/components/App';
import rootReducer from './main/reducer';

import { createProvenanceMiddleware } from '@visualstorytelling/provenance-redux';
import { ProvenanceGraphTraverser } from '@visualstorytelling/provenance-core';
import { ProvenanceGraphTree } from '@visualstorytelling/provenance-react';
const initialState = {};

const provenanceReducer = (state, action) => action.type === 'SET_STATE' ? action.state : rootReducer(state, action);
const createUndoAction = (action, currentState) => {
  return ({
    type: 'SET_STATE',
    state: currentState
  })
};

const {middleware, tracker, graph, registry} = createProvenanceMiddleware(createUndoAction);

const traverser = new ProvenanceGraphTraverser(registry, graph);

const store: Store<any> = createStore(provenanceReducer, initialState, applyMiddleware(middleware));

ReactDOM.render(
  <Provider store={store}>
    <div>
      <App />
      <ProvenanceGraphTree traverser={traverser}/>
    </div>
  </Provider>,
  document.getElementById('app')
);