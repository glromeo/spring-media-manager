import {applyMiddleware, createStore} from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import reducers from './reducers'

const logger = createLogger();
const middleware = applyMiddleware(thunk, logger);

export default function configureStore(state = {}) {
    return createStore(reducers, state, middleware);
}