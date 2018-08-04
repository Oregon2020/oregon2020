import React from 'react'
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router/immutable'
import { createHashHistory } from 'history'
import { Provider } from 'react-redux'
import { applyMiddleware, compose, createStore } from 'redux'
import { combineReducers } from 'redux-immutable'

import CONFIG from './config'
import Layout from './components/Layout'
import { reducers, INITIAL_STATE } from './reducers'

// eslint-disable-next-line no-underscore-dangle
const composeEnhancer = (CONFIG.DEBUG && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const history = createHashHistory()

const store = createStore(
    connectRouter(history)(combineReducers(reducers)),
    INITIAL_STATE,
    composeEnhancer(
        applyMiddleware(
            routerMiddleware(history)
        )
    )
)

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Layout />
        </ConnectedRouter>
    </Provider>
)

export default App
