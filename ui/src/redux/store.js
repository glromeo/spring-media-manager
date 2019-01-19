import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducers from './reducers'

const state = {};

const logger = createLogger();
const middleware = applyMiddleware(thunk, logger);

export default createStore(reducers, state, middleware);